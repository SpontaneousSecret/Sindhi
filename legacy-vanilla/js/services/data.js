/**
 * Data Service
 * Handles all data operations for Products and Orders.
 * Uses StorageService for persistence.
 */

window.SindhiApp = window.SindhiApp || {};
window.SindhiApp.Services = window.SindhiApp.Services || {};

(function () {
    'use strict';

    const Storage = window.SindhiApp.Services.Storage;

    const VERSION = "1.6"; // Forced refresh for final 290 catalog

    // 19 Distinct Categories
    const CATEGORIES = {
        CHIPS_WAFERS: 'Chips & Wafers',
        DRY_FRUIT: 'Dry Fruit',
        GOLGAPPE: 'Golgappe',
        KHAKHRA: 'Khakhra',
        HEALTHY_SNACKS: 'Healthy Snacks',
        IMPORTED_DRY_FRUIT: 'Imported Dry Fruit',
        IMPORTANT_DRY_FRUITS: 'Important Dry Fruits',
        SPICES: 'Spices (Masale)',
        MOUTH_FRESHENER: 'Mouth Freshener',
        NAV_SPECIAL: 'Navratra Special',
        PAPAD: 'Papad & Badiya',
        MAKHANA: 'Makhana',
        REGULAR_NAMKEEN: 'Regular Namkeen',
        ROASTED_CHIPS: 'Roasted Chips',
        SEEDS: 'Seeds',
        ACHAR: 'Special Achar (Pickle)',
        MATTHI: 'Special Matthi',
        COOKIES: 'Special Cookies',
        DATES: 'Imported Dates'
    };

    const REAL_PRODUCTS = [
    {
        "name": "Chilli Chips (200 g)",
        "category": "Chips & Wafers",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Chips (200 g)",
        "category": "Chips & Wafers",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Wafers Kelva",
        "category": "Chips & Wafers",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Soya Katori",
        "category": "Chips & Wafers",
        "price": 80,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Masala Soya Katori",
        "category": "Chips & Wafers",
        "price": 80,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Aloo Laccha (400 g)",
        "category": "Chips & Wafers",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chilli Aloo Laccha (400 g)",
        "category": "Chips & Wafers",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "American Almond (500 g)",
        "category": "Dry Fruit",
        "price": 600,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "California Almond (500 g)",
        "category": "Dry Fruit",
        "price": 700,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Sanora Almond (500 g)",
        "category": "Dry Fruit",
        "price": 1100,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Gulband Almond (500 g)",
        "category": "Dry Fruit",
        "price": 900,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Moti Almond (500 g)",
        "category": "Dry Fruit",
        "price": 800,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Ramu Mamra (250 g)",
        "category": "Dry Fruit",
        "price": 1200,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Afghani Mamra (250 g)",
        "category": "Dry Fruit",
        "price": 1300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "W240 Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 800,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "W180 Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 1050,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "W320 Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 700,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Salted Roasted Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Roasted Black Pepper Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Roasted Peri Peri Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Roasted Salted Almond (500 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Roasted Peri Peri Almond (500 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Chocolate Almond (500 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Chocolate Kaju (500 g)",
        "category": "Dry Fruit",
        "price": 1050,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "American Pista (500 g)",
        "category": "Dry Fruit",
        "price": 800,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Irani Pista (500 g)",
        "category": "Dry Fruit",
        "price": 900,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Plain Pista (250 g)",
        "category": "Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Kashmiri Walnut (500 g)",
        "category": "Dry Fruit",
        "price": 800,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Chilli Walnut (500 g)",
        "category": "Dry Fruit",
        "price": 1200,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Kagzi Walnut (500 g)",
        "category": "Dry Fruit",
        "price": 800,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Small Kissmiss (500 g)",
        "category": "Dry Fruit",
        "price": 400,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Big Kissmiss (500 g)",
        "category": "Dry Fruit",
        "price": 499,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Green Kissmiss (500 g)",
        "category": "Dry Fruit",
        "price": 600,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Black Kissmiss (500 g)",
        "category": "Dry Fruit",
        "price": 600,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Munakka (500 g)",
        "category": "Dry Fruit",
        "price": 750,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Atta Golgappe",
        "category": "Golgappe",
        "price": 80,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sooji Golgappe",
        "category": "Golgappe",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Fry Golgappe (250 g)",
        "category": "Golgappe",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pani Masala",
        "category": "Golgappe",
        "price": 50,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chatpata Paani",
        "category": "Golgappe",
        "price": 38,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Meetha Paani",
        "category": "Golgappe",
        "price": 38,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Meethi Chatni Masala",
        "category": "Golgappe",
        "price": 38,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Methi Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Masala Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Peri Peri Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Cheese Garlic Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pani Puri Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Achari Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Maggi Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pizza Khakhra Coin",
        "category": "Khakhra",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Methi Khakhra",
        "category": "Khakhra",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Masala Khakhra",
        "category": "Khakhra",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Peri Peri Khakhra",
        "category": "Khakhra",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pani Puri Khakhra",
        "category": "Khakhra",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Thepla",
        "category": "Khakhra",
        "price": 80,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Beans Salted",
        "category": "Healthy Snacks",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Beans Masala",
        "category": "Healthy Snacks",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Mexican Nuts Mixture",
        "category": "Healthy Snacks",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Vegetable Mix",
        "category": "Healthy Snacks",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Lady Finger (Okra)",
        "category": "Healthy Snacks",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Beetroot Mixture",
        "category": "Healthy Snacks",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pie Nuts (250 g)",
        "category": "Imported Dry Fruit",
        "price": 2250,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "With Shell Pie Nuts (250 g)",
        "category": "Imported Dry Fruit",
        "price": 2125,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Pickle Nuts (250 g)",
        "category": "Imported Dry Fruit",
        "price": 850,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Hazelnuts (250 g)",
        "category": "Imported Dry Fruit",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Macadamia Nuts (250 g)",
        "category": "Imported Dry Fruit",
        "price": 1200,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Brazil Nuts (250 g)",
        "category": "Imported Dry Fruit",
        "price": 1050,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Blueberry Dry (200 g)",
        "category": "Imported Dry Fruit",
        "price": 600,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Crime Berry Dry (200 g)",
        "category": "Imported Dry Fruit",
        "price": 400,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Dry Fruit Mix (500 g)",
        "category": "Important Dry Fruits",
        "price": 950,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Apricot (250 g)",
        "category": "Imported Dry Fruit",
        "price": 350,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Dry Apricot (200 g)",
        "category": "Imported Dry Fruit",
        "price": 400,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Honey Muesli (500 g)",
        "category": "Imported Dry Fruit",
        "price": 800,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Trail Mix (500 g)",
        "category": "Imported Dry Fruit",
        "price": 700,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Anjeer (500 g)",
        "category": "Important Dry Fruits",
        "price": 1550,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Anjeer (500 g)",
        "category": "Important Dry Fruits",
        "price": 1250,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Anjeer (500 g)",
        "category": "Important Dry Fruits",
        "price": 1050,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Afghani Turkish Anjeer (500 g)",
        "category": "Important Dry Fruits",
        "price": 1450,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Khajur Burfi",
        "category": "Important Dry Fruits",
        "price": 480,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Anjeer Burfi",
        "category": "Important Dry Fruits",
        "price": 580,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Ajwa Dates (500 g)",
        "category": "Imported Dates",
        "price": 900,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Medjoul Dates (500 g)",
        "category": "Imported Dates",
        "price": 1450,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Kalmi Dates (500 g)",
        "category": "Imported Dates",
        "price": 580,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Fard Dates (500 g)",
        "category": "Imported Dates",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Kimia Dates (500 g)",
        "category": "Imported Dates",
        "price": 380,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Seedless Dates (500 g)",
        "category": "Imported Dates",
        "price": 320,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Dry Dates (500 g)",
        "category": "Imported Dates",
        "price": 400,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Medjoul Dates (Premium) (500 g)",
        "category": "Imported Dates",
        "price": 1200,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Jeera (250 g)",
        "category": "Spices (Masale)",
        "price": 200,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Ajwain (200 g)",
        "category": "Spices (Masale)",
        "price": 160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Badi Elaichi (100 g)",
        "category": "Spices (Masale)",
        "price": 400,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Green Elaichi (100 g)",
        "category": "Spices (Masale)",
        "price": 586,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Black Pepper (100 g)",
        "category": "Spices (Masale)",
        "price": 1160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Long (100 g)",
        "category": "Spices (Masale)",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Dal Chini (100 g)",
        "category": "Spices (Masale)",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Khas Khas (Poppy Seed) (100 g)",
        "category": "Spices (Masale)",
        "price": 320,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Tej Patta (100 g)",
        "category": "Spices (Masale)",
        "price": 160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "White Pepper (100 g)",
        "category": "Spices (Masale)",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Kashmiri Garlic (100 g)",
        "category": "Spices (Masale)",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Shahi Jeera (100 g)",
        "category": "Spices (Masale)",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Hing (50 g)",
        "category": "Spices (Masale)",
        "price": 300,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sabut Hing (50 g)",
        "category": "Spices (Masale)",
        "price": 350,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Kamarkas Gond (100 g)",
        "category": "Spices (Masale)",
        "price": 140,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Multani (100 g)",
        "category": "Spices (Masale)",
        "price": 80,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gond Kathera (100 g)",
        "category": "Spices (Masale)",
        "price": 140,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gond Laddu Wali (100 g)",
        "category": "Spices (Masale)",
        "price": 140,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Coconut Burra (100 g)",
        "category": "Spices (Masale)",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Safed Musli (100 g)",
        "category": "Spices (Masale)",
        "price": 390,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Dhaga Mishri (250 g)",
        "category": "Spices (Masale)",
        "price": 160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Methi Dana (100 g)",
        "category": "Spices (Masale)",
        "price": 60,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Hing Strong (250 g)",
        "category": "Mouth Freshener",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Ram Paan",
        "category": "Mouth Freshener",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Orange Candy",
        "category": "Mouth Freshener",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Black Pepper Candy",
        "category": "Mouth Freshener",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Fatafat Goli",
        "category": "Mouth Freshener",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Swad Toffee",
        "category": "Mouth Freshener",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Kaccha Aam (250 g)",
        "category": "Mouth Freshener",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Aam Chawki (200 g)",
        "category": "Mouth Freshener",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Kala Khatta (250 g)",
        "category": "Mouth Freshener",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chikni Supari",
        "category": "Mouth Freshener",
        "price": 400,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Cutting Supari",
        "category": "Mouth Freshener",
        "price": 200,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Silver Supari",
        "category": "Mouth Freshener",
        "price": 700,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Silver Elaichi",
        "category": "Mouth Freshener",
        "price": 750,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sabudana Mixture",
        "category": "Navratra Special",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Shing Mixture",
        "category": "Navratra Special",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Salted Peanut",
        "category": "Navratra Special",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Masala Peanut",
        "category": "Navratra Special",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Red Peanut",
        "category": "Navratra Special",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Aloo Laccha Plain",
        "category": "Navratra Special",
        "price": 140,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Aloo Laccha Masala",
        "category": "Navratra Special",
        "price": 140,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Wafers",
        "category": "Navratra Special",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chilli Chips",
        "category": "Navratra Special",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Chips",
        "category": "Navratra Special",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sabudana Papad",
        "category": "Navratra Special",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sendha Namak",
        "category": "Navratra Special",
        "price": 20,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Panch Meva",
        "category": "Navratra Special",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Makhana",
        "category": "Navratra Special",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Kuttu Atta",
        "category": "Navratra Special",
        "price": 90,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Singhara Atta",
        "category": "Navratra Special",
        "price": 110,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Samak Atta",
        "category": "Navratra Special",
        "price": 90,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Samak Rice",
        "category": "Navratra Special",
        "price": 90,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sabudana",
        "category": "Navratra Special",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sindhi Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Moong Jeera Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chana Methi Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chana Masala Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chana Garlic Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Moong Special Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Amritsari Papad (400 g)",
        "category": "Papad & Badiya",
        "price": 280,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Aloo Papad (500 g)",
        "category": "Papad & Badiya",
        "price": 300,
        "image": "assets/namkeen.png"
    },
    {
        "name": "South Indian Appalam Papad",
        "category": "Papad & Badiya",
        "price": 40,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sabudana Papad",
        "category": "Papad & Badiya",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Rice Papad",
        "category": "Papad & Badiya",
        "price": 100,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Phool Badi",
        "category": "Papad & Badiya",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Aloo Chips Papad",
        "category": "Papad & Badiya",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Amritsari Badi",
        "category": "Papad & Badiya",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Moong Masala Badi",
        "category": "Papad & Badiya",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Moong Plain Badi",
        "category": "Papad & Badiya",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Makhana (250 g)",
        "category": "Makhana",
        "price": 490,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Peri Peri Makhana (100 g)",
        "category": "Makhana",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Salted Makhana (100 g)",
        "category": "Makhana",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Black Pepper Makhana (100 g)",
        "category": "Makhana",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chaat Masala Makhana (100 g)",
        "category": "Makhana",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pudina Makhana (100 g)",
        "category": "Makhana",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Achari Makhana (100 g)",
        "category": "Makhana",
        "price": 220,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Black Salt (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Sea Vinegar Salt (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Himalayan Salt (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pudina (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Peri Peri (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Tomato (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Cream Onion (60 g)",
        "category": "Makhana",
        "price": 150,
        "image": "assets/namkeen.png"
    },
    {
        "name": "South Indian Mixture",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Bombay Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Navratan Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gathiya Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Pidam Mix",
        "category": "Regular Namkeen",
        "price": 200,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Navrang Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Nasar Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "K.C. Mixture",
        "category": "Regular Namkeen",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Khatta Meetha Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Maize Cornflake Mix",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Bhujia",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Bikaneri Bhujia",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Aloo Bhujia",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Garlic Sev",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Teekha Sev",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Ratlami Sev",
        "category": "Regular Namkeen",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "O Number Sev",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Kadi Patta Bundi",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Bundi",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Moongra",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "White Chidwa",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Cornflake Chidwa",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Soya Bhel (400 g)",
        "category": "Regular Namkeen",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Jowar Bajra (400 g)",
        "category": "Regular Namkeen",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Moong Dal (400 g)",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chana Dal (400 g)",
        "category": "Regular Namkeen",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Roasted Moong (100 g)",
        "category": "Regular Namkeen",
        "price": 240,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Bhavnagri Sev (400 g)",
        "category": "Regular Namkeen",
        "price": 160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Corn Triangle (350 g)",
        "category": "Roasted Chips",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Makhana Peri Peri Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Makhana Cream Onion Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Beetroot Peri Peri Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Beetroot Cream Onion Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Ragi Cream Onion Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Ragi Manchurian Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Ragi Pudina Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Soya Sticks (250 g)",
        "category": "Roasted Chips",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Soya Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Salted Banana Chips (400 g)",
        "category": "Roasted Chips",
        "price": 280,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Black Pepper Banana Chips (400 g)",
        "category": "Roasted Chips",
        "price": 280,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chana Jor Garam (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Corn Mixture (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Jowar Bajra Mix (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Zucchini Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Peri Peri Bhindi (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Salted Bhindi (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Bhel Puri Mix (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gathiya Besan (325 g)",
        "category": "Roasted Chips",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Besan Papdi (250 g)",
        "category": "Roasted Chips",
        "price": 120,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Plain Garlic Chakli (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Masala Garlic Chakli (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "South Indian Chakli Masala (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Tapioca Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Corn Nachos Chips",
        "category": "Roasted Chips",
        "price": 180,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Mix Vegetable Chips (250 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "South Indian Chakli Plain (400 g)",
        "category": "Roasted Chips",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Mix Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Pumpkin Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Sunflower Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Watermelon Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Muskmelon Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Flax Seeds (200 g)",
        "category": "Seeds",
        "price": 150,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Sabja Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Chia Seeds (200 g)",
        "category": "Seeds",
        "price": 300,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Roasted Mix Seeds (200 g)",
        "category": "Seeds",
        "price": 360,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Roasted Mix Seeds (500 g)",
        "category": "Seeds",
        "price": 900,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Sesame Seeds (200 g)",
        "category": "Seeds",
        "price": 150,
        "image": "assets/dryfruits.png"
    },
    {
        "name": "Punjabi Mango Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Hing Mango Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Cutting Mango Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Mango Chaatni Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Lemon Chaatni Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Green Chilli Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Spicy Green Chilli Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Red Chilli Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Garlic Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 300,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gajar Gobhi Shalgam Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Tenti Dela Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Lasode Ka Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Khatta Lemon Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Dry Mango Pickle (500 g)",
        "category": "Special Achar (Pickle)",
        "price": 250,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Atta Cookies (400 g)",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Gur Atta Cookies (400 g)",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Desi Ghee Atta Cookies (400 g)",
        "category": "Special Cookies",
        "price": 350,
        "image": "assets/hero.png"
    },
    {
        "name": "Jeera Cookies (400 g)",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Ajwain Cookies (400 g)",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Honey Oats Cookies (400 g)",
        "category": "Special Cookies",
        "price": 300,
        "image": "assets/hero.png"
    },
    {
        "name": "Sattu Chana Cookies (400 g)",
        "category": "Special Cookies",
        "price": 350,
        "image": "assets/hero.png"
    },
    {
        "name": "Multigrain Cookies (400 g)",
        "category": "Special Cookies",
        "price": 350,
        "image": "assets/hero.png"
    },
    {
        "name": "Dry Fruit Cookies (400 g)",
        "category": "Special Cookies",
        "price": 350,
        "image": "assets/hero.png"
    },
    {
        "name": "Kaju Pista Cookies (400 g)",
        "category": "Special Cookies",
        "price": 320,
        "image": "assets/hero.png"
    },
    {
        "name": "Fruit Cake Rusk (400 g)",
        "category": "Special Cookies",
        "price": 300,
        "image": "assets/hero.png"
    },
    {
        "name": "Plain Cake Rusk (400 g)",
        "category": "Special Cookies",
        "price": 300,
        "image": "assets/hero.png"
    },
    {
        "name": "Thin Almond Cookies",
        "category": "Special Cookies",
        "price": 350,
        "image": "assets/hero.png"
    },
    {
        "name": "American Cashew Nut Cookies",
        "category": "Special Cookies",
        "price": 280,
        "image": "assets/hero.png"
    },
    {
        "name": "Sugar Free Thin Almond Cookies",
        "category": "Special Cookies",
        "price": 380,
        "image": "assets/hero.png"
    },
    {
        "name": "Ajwain Fan",
        "category": "Special Cookies",
        "price": 180,
        "image": "assets/hero.png"
    },
    {
        "name": "Ajwain Masori",
        "category": "Special Cookies",
        "price": 180,
        "image": "assets/hero.png"
    },
    {
        "name": "Plain Khari Puff",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Saunf Rusk",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Milk Dehraduni Rusk",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Sugar Free Rusk",
        "category": "Special Cookies",
        "price": 190,
        "image": "assets/hero.png"
    },
    {
        "name": "Sugar Free Oats Rusk",
        "category": "Special Cookies",
        "price": 150,
        "image": "assets/hero.png"
    },
    {
        "name": "Garlic Toast",
        "category": "Special Cookies",
        "price": 240,
        "image": "assets/hero.png"
    },
    {
        "name": "Normal Rusk",
        "category": "Special Cookies",
        "price": 80,
        "image": "assets/hero.png"
    },
    {
        "name": "Normal Saunf Rusk",
        "category": "Special Cookies",
        "price": 150,
        "image": "assets/hero.png"
    },
    {
        "name": "Plain Matthi (500 g)",
        "category": "Special Matthi",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Methi Matthi (500 g)",
        "category": "Special Matthi",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Khajur Matthi (500 g)",
        "category": "Special Matthi",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gud Pare (500 g)",
        "category": "Special Matthi",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Namak Pare (400 g)",
        "category": "Special Matthi",
        "price": 160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Chaat Papdi (400 g)",
        "category": "Special Matthi",
        "price": 160,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Shakkar Pare (500 g)",
        "category": "Special Matthi",
        "price": 170,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Achari Matthi (500 g)",
        "category": "Special Matthi",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Dal Kachori (500 g)",
        "category": "Special Matthi",
        "price": 200,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Atta Flax Seed Matthi (500 g)",
        "category": "Special Matthi",
        "price": 320,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Gud Tangri (500 g)",
        "category": "Special Matthi",
        "price": 190,
        "image": "assets/namkeen.png"
    },
    {
        "name": "Hing Kachori",
        "category": "Special Matthi",
        "price": 280,
        "image": "assets/namkeen.png"
    }
];

    function generateProducts() {
        return REAL_PRODUCTS.map((p, index) => ({
            id: index + 1,
            ...p,
            inStock: true,
            rating: (4.5 + Math.random() * 0.5).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 50
        }));
    }

    function initData() {
        const currentVersion = Storage.get('data_version');
        const currentProducts = Storage.get('products');

        if (currentVersion !== VERSION || !currentProducts || currentProducts.length < 280) {
            const products = generateProducts();
            Storage.set('products', products);
            Storage.set('data_version', VERSION);
        }

        if (!Storage.get('sindhi_orders')) {
            Storage.set('sindhi_orders', []);
        }
    }

    const ProductService = {
        getAll: () => Storage.get('products', []),
        getByCategory: (category) => {
            const products = ProductService.getAll();
            if (category === 'All') return products;
            return products.filter(p => p.category === category);
        },
        add: (product) => {
            const products = ProductService.getAll();
            product.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.unshift(product);
            Storage.set('products', products);
            return product;
        },
        update: (product) => {
            let products = ProductService.getAll();
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) {
                products[index] = product;
                Storage.set('products', products);
                return true;
            }
            return false;
        },
        delete: (id) => {
            let products = ProductService.getAll();
            products = products.filter(p => p.id !== id);
            Storage.set('products', products);
        }
    };

    const OrderService = {
        getAll: () => Storage.get('sindhi_orders', []),
        add: (order) => {
            const orders = OrderService.getAll();
            order.id = Date.now();
            order.date = new Date().toISOString();
            order.status = 'Pending';
            orders.unshift(order);
            Storage.set('sindhi_orders', orders);
            return order;
        }
    };

    initData();
    window.SindhiApp.Services.Products = ProductService;
    window.SindhiApp.Services.Orders = OrderService;
})();
