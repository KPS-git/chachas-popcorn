from django.http import Http404
from django.shortcuts import render
from django.urls import path


PRODUCTS = {
    "original": {
        "slug": "original",
        "name": "Original",
        "badge": "Classic",
        "subtitle": "Classic butter popcorn",
        "price": "$14.99",
        "size": "12 oz bag",
        "image": "images/original-popcorn.jpg",
        "description": "Light, crisp, buttery, and built for the person who wants popcorn done right without overthinking it.",
        "flavor_profile": "A clean, buttery, classic popcorn flavor with a light crunch and an easy, familiar finish.",
        "ingredients": "Popcorn, oil, butter-style seasoning, salt. Final ingredient list to be confirmed by ChaCha’s before launch.",
        "notes": ["Buttery", "Crisp", "Classic"],
    },
    "cheddar": {
        "slug": "cheddar",
        "name": "Cheddar",
        "badge": "Savory",
        "subtitle": "Bold savory cheddar",
        "price": "$15.99",
        "size": "12 oz bag",
        "image": "images/cheddar-popcorn.jpg",
        "description": "Rich cheddar flavor over crisp popcorn for a snack that tastes louder, cheesier, and more addictive.",
        "flavor_profile": "A bold, cheesy, savory profile with a salty bite and strong snackable finish.",
        "ingredients": "Popcorn, oil, cheddar-style seasoning, salt. Final ingredient list to be confirmed by ChaCha’s before launch.",
        "notes": ["Cheesy", "Bold", "Savory"],
    },
    "caramel": {
        "slug": "caramel",
        "name": "Caramel",
        "badge": "Sweet",
        "subtitle": "Sweet golden crunch",
        "price": "$16.99",
        "size": "12 oz bag",
        "image": "images/caramel-popcorn.jpg",
        "description": "Golden caramel, serious crunch, and a sweet toasted finish that makes it hard to stop reaching back in.",
        "flavor_profile": "A glossy caramel crunch with toasted sweetness, golden richness, and a clean candy-shop finish.",
        "ingredients": "Popcorn, caramel coating, sugar, butter-style flavor, salt. Final ingredient list to be confirmed by ChaCha’s before launch.",
        "notes": ["Golden Glaze", "Sweet Crunch", "Fan Favorite"],
    },
}


def product_detail(request, slug):
    product = PRODUCTS.get(slug)

    if not product:
        raise Http404("Product not found")

    related_products = [
        item for key, item in PRODUCTS.items()
        if key != slug
    ]

    return render(
        request,
        "product-detail.html",
        {
            "product": product,
            "related_products": related_products,
        },
    )


urlpatterns = [
    path("", lambda request: render(request, "home.html"), name="home"),
    path("shop/", lambda request: render(request, "shop.html"), name="shop"),

    path("product/<slug:slug>/", product_detail, name="product_detail"),

    path("cart/", lambda request: render(request, "cart.html"), name="cart"),
    path("checkout/", lambda request: render(request, "checkout.html"), name="checkout"),
    path("success/", lambda request: render(request, "success.html"), name="success"),
    path("account/", lambda request: render(request, "account.html"), name="account"),
    path("login/", lambda request: render(request, "login.html"), name="login"),
    path("faq/", lambda request: render(request, "faq.html"), name="faq"),
    path("contact/", lambda request: render(request, "contact.html"), name="contact"),
    path("shipping/", lambda request: render(request, "shipping.html"), name="shipping"),
    path("returns/", lambda request: render(request, "returns.html"), name="returns"),
    path("privacy/", lambda request: render(request, "privacy.html"), name="privacy"),
    path("terms/", lambda request: render(request, "terms.html"), name="terms"),
]