document.addEventListener("DOMContentLoaded", function () {
    const products = [
        {
            name: "iPhone 13",
            description: "أفضل هاتف ذكي لعام 2025 مع ميزات متطورة.",
            imageUrl: "https://via.placeholder.com/400",
            amazonLink: "https://www.amazon.com/dp/B07XJ8C8F5?tag=youraffiliateid"
        },
        {
            name: "Samsung Galaxy S22",
            description: "أفضل هاتف ذكي بشاشة مذهلة وكاميرا متطورة.",
            imageUrl: "https://via.placeholder.com/400",
            amazonLink: "https://www.amazon.com/dp/B08JHLZ2TZ?tag=youraffiliateid"
        },
        {
            name: "Smart Watch X",
            description: "ساعة ذكية مع تتبع للياقة البدنية ومزايا متقدمة.",
            imageUrl: "https://via.placeholder.com/400",
            amazonLink: "https://www.amazon.com/dp/B07MZZ3HR7?tag=youraffiliateid"
        }
    ];

    const container = document.getElementById("product-list-container");

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <a href="${product.amazonLink}" target="_blank" class="btn-buy">اشتري الآن</a>
        `;

        container.appendChild(productDiv);
    });
});
