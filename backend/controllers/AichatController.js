const OpenAI = require("openai");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Collection = require("../models/Collection");

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAiClient = () => {
  // Prefer real OpenAI when configured
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }

  // Fallback: Cerebras (OpenAI-compatible)
  if (process.env.CEREBRAS_API_KEY) {
    return {
      provider: "cerebras",
      client: new OpenAI({
        apiKey: process.env.CEREBRAS_API_KEY,
        baseURL: "https://api.cerebras.ai/v1",
      }),
      model: process.env.CEREBRAS_MODEL || "gemma-4-31b",
    };
  }

  return null;
};

const formatProduct = (p) => {
  const variants =
    Array.isArray(p.variants) && p.variants.length
      ? p.variants
          .map(
            (v) =>
              `${v.size || "N/A"}/${v.color || "N/A"} (₹${v.price}, stock ${v.stock ?? 0})`
          )
          .join("; ")
      : "None";

  return [
    `Product: ${p.name}`,
    `ID: ${p._id}`,
    `Price: ₹${p.price}`,
    `Description: ${p.description || "No description"}`,
    `Brand: ${p.brand?.name || "N/A"}`,
    `Category: ${p.category?.name || "N/A"}`,
    `Stock: ${p.stock ?? 0}`,
    `Featured: ${p.isFeatured ? "Yes" : "No"}`,
    `Type: ${p.productType || "standard"}`,
    `Variants: ${variants}`,
  ].join("\n");
};

const searchStoreProducts = async (message) => {
  const safeQuery = escapeRegex(message.trim());
  const searchRegex = new RegExp(safeQuery, "i");

  const [categories, brands] = await Promise.all([
    Category.find({ name: searchRegex, isActive: { $ne: false } }).select("_id"),
    Brand.find({ name: searchRegex, isActive: { $ne: false } }).select("_id"),
  ]);

  const categoryIds = categories.map((c) => c._id);
  const brandIds = brands.map((b) => b._id);

  let products = await Product.find({
    isActive: { $ne: false },
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { category: { $in: categoryIds } },
      { brand: { $in: brandIds } },
    ],
  })
    .populate("category", "name")
    .populate("brand", "name")
    .sort({ createdAt: -1 })
    .limit(8);

  if (!products.length) {
    try {
      products = await Product.find(
        {
          isActive: { $ne: false },
          $text: { $search: message },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .populate("category", "name")
        .populate("brand", "name")
        .limit(8);
    } catch (err) {
      console.log("Text search skipped:", err.message);
    }
  }

  if (!products.length) {
    const looksLikeBrowse =
      /\b(product|products|sell|shop|catalog|available|recommend|suggest|show|list|what|category|categories|brand|brands|hi|hello|hey)\b/i.test(
        message
      );

    if (looksLikeBrowse) {
      products = await Product.find({ isActive: { $ne: false } })
        .populate("category", "name")
        .populate("brand", "name")
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(8);
    }
  }

  return products;
};

const buildStoreContext = async () => {
  const [categories, brands, collections, productCount, featured] =
    await Promise.all([
      Category.find({ isActive: { $ne: false } })
        .select("name description")
        .sort({ name: 1 })
        .limit(30),
      Brand.find({ isActive: { $ne: false } })
        .select("name description")
        .sort({ name: 1 })
        .limit(30),
      Collection.find({ isActive: { $ne: false } })
        .select("collectionTitle description")
        .sort({ collectionTitle: 1 })
        .limit(20),
      Product.countDocuments({ isActive: { $ne: false } }),
      Product.find({ isActive: { $ne: false }, isFeatured: true })
        .select("name price")
        .limit(5),
    ]);

  const categoryInfo = categories.length
    ? categories
        .map((c) => `- ${c.name}${c.description ? `: ${c.description}` : ""}`)
        .join("\n")
    : "No categories yet.";

  const brandInfo = brands.length
    ? brands
        .map((b) => `- ${b.name}${b.description ? `: ${b.description}` : ""}`)
        .join("\n")
    : "No brands yet.";

  const collectionInfo = collections.length
    ? collections
        .map(
          (c) =>
            `- ${c.collectionTitle}${c.description ? `: ${c.description}` : ""}`
        )
        .join("\n")
    : "No collections yet.";

  const featuredInfo = featured.length
    ? featured.map((p) => `- ${p.name} (₹${p.price})`).join("\n")
    : "No featured products.";

  return {
    text: `
STORE OVERVIEW:
- Active products in catalog: ${productCount}
- Customers can browse shop, collections, brands, search, cart, and checkout.
- Payments use Razorpay on checkout.
- Users can register/login; admins manage catalog from the admin dashboard.

SITE PAGES (tell users where to go):
- Home: /
- Shop all products: /shop-product
- Search: /search
- Cart: /cart
- Checkout: /checkout
- Login: /login
- Register: /register
- Product details: /product/<productId>
- Collection: /collection/<collectionId>
- Brand products: /brand/<brandId>
- User dashboard (orders/profile): /user

CATEGORIES:
${categoryInfo}

BRANDS:
${brandInfo}

COLLECTIONS:
${collectionInfo}

FEATURED PRODUCTS:
${featuredInfo}
`.trim(),
    categories,
    brands,
    collections,
    productCount,
    featured,
  };
};

/** Works even when the LLM provider is down / unpaid */
const buildCatalogFallbackReply = ({ message, products, store }) => {
  const lower = message.toLowerCase();

  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))\b/.test(lower)) {
    return `Hi! I'm ShopBot. We currently have ${store.productCount} products. Ask me about products, categories, brands, cart, or checkout.`;
  }

  if (/\b(categor(y|ies))\b/.test(lower)) {
    if (!store.categories.length) {
      return "We don't have any categories listed yet. You can browse everything at /shop-product.";
    }
    return `Here are our categories:\n${store.categories
      .map((c) => `• ${c.name}`)
      .join("\n")}\n\nBrowse the shop at /shop-product or ask for a category by name.`;
  }

  if (/\b(brand|brands)\b/.test(lower)) {
    if (!store.brands.length) {
      return "We don't have any brands listed yet. You can browse everything at /shop-product.";
    }
    return `Here are our brands:\n${store.brands
      .map((b) => `• ${b.name}`)
      .join("\n")}\n\nOpen a brand from the Brands section on the home page, or ask me for products from a brand.`;
  }

  if (/\b(collection|collections)\b/.test(lower)) {
    if (!store.collections.length) {
      return "No collections are available right now. Try /shop-product.";
    }
    return `Here are our collections:\n${store.collections
      .map((c) => `• ${c.collectionTitle}`)
      .join("\n")}\n\nOpen them from the Collections section on the home page.`;
  }

  if (/\b(cart|checkout|pay|payment|razorpay|order)\b/.test(lower)) {
    return "Add items from a product page, open /cart to review them, then go to /checkout to pay securely with Razorpay. You can track orders after login at /user.";
  }

  if (/\b(login|register|sign\s?up|account)\b/.test(lower)) {
    return "Use /login to sign in or /register to create an account. Your dashboard is at /user.";
  }

  if (products.length) {
    const lines = products.slice(0, 5).map((p) => {
      const brand = p.brand?.name ? ` · ${p.brand.name}` : "";
      const category = p.category?.name ? ` · ${p.category.name}` : "";
      return `• ${p.name} — ₹${p.price}${brand}${category} (stock: ${p.stock ?? 0}) → /product/${p._id}`;
    });
    return `Here's what I found in our store:\n${lines.join(
      "\n"
    )}\n\nAsk for another product, category, or brand if you want more options.`;
  }

  return `I couldn't find matching products for that. Browse /shop-product, search at /search, or ask about a product name, category, or brand. We currently have ${store.productCount} products in the catalog.`;
};

const Aichatbot = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const [products, store] = await Promise.all([
      searchStoreProducts(message),
      buildStoreContext(),
    ]);

    const productInfo = products.length
      ? products.map(formatProduct).join("\n\n")
      : "No matching products were found for this question.";

    const ai = getAiClient();

    // No AI key configured → still answer from catalog
    if (!ai) {
      return res.status(200).json({
        success: true,
        reply: buildCatalogFallbackReply({ message, products, store }),
        products,
        mode: "catalog",
      });
    }

    const chatHistory = Array.isArray(history)
      ? history
          .slice(-6)
          .filter(
            (h) =>
              h &&
              (h.role === "user" || h.role === "assistant") &&
              typeof h.content === "string" &&
              h.content.trim()
          )
          .map((h) => ({ role: h.role, content: h.content.trim() }))
      : [];

    try {
      const completion = await ai.client.chat.completions.create({
        model: ai.model,
        temperature: 0.4,
        max_completion_tokens: 550,
        messages: [
          {
            role: "system",
            content: `
        You are ShopBot, the official AI shopping assistant for this MERN eCommerce store.

        Your job:
        - Help customers with products, categories, brands, collections, prices, stock, and how to use the site.
        - Use ONLY the store data provided below. Never invent products, prices, stock, brands, or categories.
        - If matching products are listed, recommend those and include price + key details.
        - If no matching products are found, say so clearly and suggest browsing /shop-product or asking with a product/category/brand name.
        - For site/help questions (cart, checkout, login, search), use the SITE PAGES section.
        - Keep replies short, friendly, and practical.
        - Use Indian Rupee (₹) when mentioning prices.
        - Do not discuss admin-only actions or invent policies that are not provided.

${store.text}
            `.trim(),
          },
          ...chatHistory,
          {
            role: "user",
            content: `
Customer Question:
${message}

Matching Products for this question:
${productInfo}
            `.trim(),
          },
        ],
      });

      const reply =
        completion.choices?.[0]?.message?.content?.trim() ||
        buildCatalogFallbackReply({ message, products, store });

      return res.status(200).json({
        success: true,
        reply,
        products,
        mode: ai.provider,
      });
    } catch (aiError) {
      console.error("AI provider error:", aiError.status, aiError.message);

      // Cerebras unpaid / OpenAI quota / network → still help from MongoDB catalog
      const catalogReply = buildCatalogFallbackReply({
        message,
        products,
        store,
      });

      let notice = "";
      if (aiError.status === 402) {
        notice =
          "\n\n(Note: AI provider billing/quota is unavailable right now, so I answered from our live catalog.)";
      } else if (aiError.status === 401 || aiError.status === 403) {
        notice =
          "\n\n(Note: AI API key is invalid. Showing catalog results instead.)";
      }

      return res.status(200).json({
        success: true,
        reply: `${catalogReply}${notice}`,
        products,
        mode: "catalog-fallback",
      });
    }
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};

module.exports = {
  Aichatbot,
};
