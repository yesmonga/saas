import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const salesData = [
  { title: "New Balance 9060 Beige 38", paid: 100, sale: 145, profit: 45, date: "2025-05-04", platform: "Vinted" },
  { title: "Jordan Jumpman Jack TR Travis Scott Bright Cactus 42", paid: 213, sale: 260, profit: 47, date: "2025-05-05", platform: "Vinted" },
  { title: "Bundle EV 3.5 151", paid: 39, sale: 79, profit: 40, date: "2025-06-10", platform: "Beebs" },
  { title: "Bundle EV 3.5 151", paid: 39, sale: 79, profit: 40, date: "2025-06-10", platform: "Beebs" },
  { title: "Bundle EV 3.5 151", paid: 39, sale: 69, profit: 30, date: "2025-06-10", platform: "Beebs" },
  { title: "Bundle EV 3.5 151", paid: 39, sale: 70, profit: 31, date: "2025-06-10", platform: "Beebs" },
  { title: "Salomon Baskets XT-6 Pink 40,5", paid: 108, sale: 165, profit: 57, date: "2025-07-10", platform: "Vinted" },
  { title: "Bratz x Jean Paul Gaultier", paid: 130, sale: 160, profit: 30, date: "2025-07-10", platform: "Vinted" },
  { title: "Nike Air Max 95 Corteiz Honey Black 42.5", paid: 202.99, sale: 230, profit: 27.01, date: "2025-07-10", platform: "Shop" },
  { title: "Nike Air Max 95 Corteiz Honey Black 45", paid: 202.99, sale: 230, profit: 27.01, date: "2025-07-10", platform: "Shop" },
  { title: "Nike Air Max 95 Corteiz Honey Black 43", paid: 202.99, sale: 230, profit: 27.01, date: "2025-07-10", platform: "Shop" },
  { title: "Nike Air Max 95 Corteiz Honey Black 44.5", paid: 202.99, sale: 230, profit: 27.01, date: "2025-07-10", platform: "Shop" },
  { title: "Pop Mart LABUBU x Pronounce – Wings of Fortune", paid: 36, sale: 49.50, profit: 13.50, date: "2025-07-10", platform: "Vinted" },
  { title: "SALOMON XT-4 OG 44 Blanche", paid: 95, sale: 140, profit: 45, date: "2025-07-10", platform: "Vinted" },
  { title: "ASICS Gel-Kayano 14 Oyster White Steeple Grey", paid: 133, sale: 120, profit: -13, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart Cry Box", paid: 16.80, sale: 25, profit: 8.20, date: "2025-07-10", platform: "Vinted" },
  { title: "Bundle EV 3.5 151", paid: 34.99, sale: 69, profit: 34.01, date: "2025-07-10", platform: "Beebs" },
  { title: "Coffret Pokémon Super-Premium EV8.5 Évolutions Prismatiques", paid: 130, sale: 170, profit: 40, date: "2025-07-10", platform: "Beebs" },
  { title: "Charles Leclerc CAP", paid: 52.50, sale: 85, profit: 32.50, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart Seat Box", paid: 19.20, sale: 39.99, profit: 20.79, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart - Exciting Macaron Box x3", paid: 60, sale: 152.50, profit: 92.50, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart - Labubu Let's Checkmate", paid: 90, sale: 115, profit: 25, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart Cry Box", paid: 16.80, sale: 35, profit: 18.20, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart Seat Box x10", paid: 192, sale: 385, profit: 193, date: "2025-07-10", platform: "Vinted" },
  { title: "Pop Mart Big Into Box", paid: 23.19, sale: 55, profit: 31.81, date: "2025-07-10", platform: "Vinted" },
  { title: "Bundle EV 3.5 151", paid: 34.99, sale: 66, profit: 31.01, date: "2025-07-10", platform: "Beebs" },
  { title: "Bundle EV 3.5 151", paid: 34.99, sale: 65, profit: 30.01, date: "2025-07-10", platform: "Beebs" },
  { title: "Pop Mart Cry Box", paid: 16.80, sale: 35, profit: 18.20, date: "2025-07-10", platform: "Vinted" },
  { title: "ETB EV10", paid: 69.90, sale: 93, profit: 23.10, date: "2025-07-10", platform: "Vinted" },
  { title: "ETB EV10", paid: 69.90, sale: 90, profit: 20.10, date: "2025-07-10", platform: "Leboncoin" },
  { title: "ETB EV10", paid: 69.90, sale: 90, profit: 20.10, date: "2025-07-10", platform: "Leboncoin" },
  { title: "Pop Mart Seat Whole Set", paid: 120, sale: 170, profit: 50, date: "2025-07-10", platform: "Vinted" },
  { title: "New Balance 740v2 Concord Grape 43", paid: 90, sale: 137, profit: 47, date: "2025-07-11", platform: "Vinted" },
  { title: "Bundle EV 3.5 151", paid: 34.99, sale: 65, profit: 30.01, date: "2025-07-13", platform: "Beebs" },
  { title: "Charles Leclerc CAP", paid: 52.50, sale: 95, profit: 42.50, date: "2025-07-18", platform: "Vestiaire collective" },
  { title: "Salomon Baskets XT-6 Pink 37,5", paid: 108, sale: 159.99, profit: 51.99, date: "2025-07-18", platform: "Vinted" },
  { title: "Pop Mart Seat Box", paid: 19.20, sale: 34.99, profit: 15.79, date: "2025-07-18", platform: "Vinted" },
  { title: "Salomon Baskets XT-6 Pink 38", paid: 108, sale: 159.99, profit: 51.99, date: "2025-07-18", platform: "Vinted" },
  { title: "adidas Originals x ASOS - Veste de survêtement M", paid: 145.99, sale: 180, profit: 34.01, date: "2025-07-20", platform: "Vinted" },
  { title: "adidas Originals x ASOS - Veste de survêtement XS", paid: 115.99, sale: 175, profit: 59.01, date: "2025-08-01", platform: "Mains propre" },
  { title: "Pop Mart Big Into Whole Box", paid: 115.20, sale: 155, profit: 39.80, date: "2025-08-01", platform: "Vinted" },
  { title: "Salomon Baskets XT-6 Pink 36,5", paid: 108, sale: 155, profit: 47, date: "2025-08-01", platform: "Vinted" },
  { title: "DUNK LOW LX Noir", paid: 68.89, sale: 90, profit: 21.11, date: "2025-08-01", platform: "Vinted" },
  { title: "SALOMON XT-4 OG 44 Blanche", paid: 95, sale: 138, profit: 43, date: "2025-08-01", platform: "Vinted" },
  { title: "New Balance 9060 Beige Rose 37", paid: 87.99, sale: 135, profit: 47.01, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Big Into Whole Box", paid: 115.20, sale: 155, profit: 39.80, date: "2025-08-01", platform: "Vinted" },
  { title: "Charles Leclerc CAP", paid: 52.50, sale: 69.99, profit: 17.49, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Cry Box", paid: 16.80, sale: 19.99, profit: 3.19, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Seat Box", paid: 19.20, sale: 34.99, profit: 15.79, date: "2025-08-01", platform: "Vinted" },
  { title: "Salomon Baskets XT-6 Pink 38", paid: 108, sale: 159.99, profit: 51.99, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Seat Whole Set", paid: 120, sale: 155, profit: 35, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Seat Whole Set", paid: 120, sale: 155, profit: 35, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Seat Whole Set", paid: 120, sale: 165, profit: 45, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart Hirono Living", paid: 32.40, sale: 42, profit: 9.60, date: "2025-08-01", platform: "Vinted" },
  { title: "Pop Mart - Exciting Macaron Box", paid: 20, sale: 38, profit: 18, date: "2025-08-01", platform: "Vinted" },
  { title: "Salomon – XT-6 GTX Carbon / Vanilla Ice / Liberty 36.5", paid: 100, sale: 154.99, profit: 54.99, date: "2025-08-02", platform: "Vinted" },
  { title: "Bratz x Jean Paul Gaultier", paid: 130, sale: 165, profit: 35, date: "2025-08-02", platform: "Vinted" },
  { title: "New Balance ABZORB 2000 42,5", paid: 200, sale: 215, profit: 15, date: "2025-08-02", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea 36.5", paid: 100, sale: 148, profit: 48, date: "2025-08-11", platform: "Vinted" },
  { title: "Pop Mart Big Into Whole Box", paid: 120, sale: 155, profit: 35, date: "2025-08-11", platform: "Vinted" },
  { title: "Pop Mart Big Into Whole Box", paid: 120, sale: 155, profit: 35, date: "2025-08-11", platform: "Vinted" },
  { title: "Pop Mart Big Into Whole Box", paid: 120, sale: 155, profit: 35, date: "2025-08-11", platform: "Vinted" },
  { title: "Charles Leclerc CAP", paid: 52.50, sale: 93.50, profit: 41, date: "2025-09-29", platform: "Vestiaire collective" },
  { title: "Asics Gel NYC Cream Cloud Grey Blue", paid: 119.96, sale: 139.99, profit: 20.03, date: "2025-09-29", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 159.99, profit: 55.99, date: "2025-10-04", platform: "Vinted" },
  { title: "Hot Wheels Transformers Nemesis Prime", paid: 68, sale: 115, profit: 47, date: "2025-10-04", platform: "Vinted" },
  { title: "Hot Wheels Transformers Nemesis Prime", paid: 68, sale: 115, profit: 47, date: "2025-10-04", platform: "Vinted" },
  { title: "Adidas Sambae W Rouge", paid: 101.64, sale: 110, profit: 8.36, date: "2025-10-04", platform: "Vinted" },
  { title: "Casio CRW-001-1", paid: 119, sale: 125, profit: 6, date: "2025-10-06", platform: "Vinted" },
  { title: "Moon Shoe Jacquemus + Nike", paid: 180, sale: 205, profit: 25, date: "2025-10-06", platform: "Vinted" },
  { title: "Moon Shoe Jacquemus + Nike", paid: 180, sale: 210, profit: 30, date: "2025-10-06", platform: "Vinted" },
  { title: "Moon Shoe Jacquemus + Nike", paid: 180, sale: 205, profit: 25, date: "2025-10-06", platform: "Vinted" },
  { title: "Hot Wheels Transformers Nemesis Prime", paid: 68, sale: 119.99, profit: 51.99, date: "2025-10-06", platform: "Vinted" },
  { title: "Salomon xt-6 ghost gray", paid: 104, sale: 150, profit: 46, date: "2025-10-14", platform: "Vinted" },
  { title: "Jordan 1 retro LW OG", paid: 160, sale: 180, profit: 20, date: "2025-10-14", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 145, profit: 41, date: "2025-10-14", platform: "Vinted" },
  { title: "Disney Designer Collection 2025 – Giselle", paid: 175.50, sale: 230, profit: 54.50, date: "2025-10-14", platform: "Vinted" },
  { title: "Disney Designer Collection 2025 – Giselle", paid: 175.50, sale: 209, profit: 33.50, date: "2025-10-14", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 150, profit: 46, date: "2025-10-14", platform: "Vinted" },
  { title: "Casio CRW-001-1", paid: 119, sale: 123, profit: 4, date: "2025-10-14", platform: "Vinted" },
  { title: "Rlc Exclusive Rwb Porsche 930", paid: 40, sale: 144.72, profit: 104.72, date: "2025-10-14", platform: "Vinted" },
  { title: "Rlc Exclusive Rwb Porsche 930", paid: 40, sale: 170, profit: 130, date: "2025-10-14", platform: "Vinted" },
  { title: "Salomon xt 6 white fairy tale almond milk", paid: 100, sale: 155, profit: 55, date: "2025-10-14", platform: "Vinted" },
  { title: "Moon Shoe Jacquemus + Nike", paid: 180, sale: 219, profit: 39, date: "2025-10-14", platform: "Vinted" },
  { title: "Pop Mart Hirono Living", paid: 32.40, sale: 29.99, profit: -2.41, date: "2025-10-21", platform: "Vinted" },
  { title: "Salomon xt 6 white lunar rock bleue un peu 41,5", paid: 105, sale: 137, profit: 32, date: "2025-10-21", platform: "Vinted" },
  { title: "Salomon – XT-6 GTX Antelope / Icicle / Portabella", paid: 92.50, sale: 163, profit: 70.50, date: "2025-10-21", platform: "Vinted" },
  { title: "THE LIFE OF A SHOWGIRL Vinyl Blue", paid: 34.99, sale: 79.99, profit: 45, date: "2025-10-21", platform: "Vinted" },
  { title: "THE LIFE OF A SHOWGIRL Vinyl Blue", paid: 34.99, sale: 70, profit: 35.01, date: "2025-10-21", platform: "Vinted" },
  { title: "SALOMON XT-6 GTX BLACK / BLACK / SILVER", paid: 100, sale: 149.99, profit: 49.99, date: "2025-10-21", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 159.99, profit: 55.99, date: "2025-10-21", platform: "Vinted" },
  { title: "Funko POP! Moment – Itachi (Susano'o)", paid: 38, sale: 117, profit: 79, date: "2025-10-21", platform: "Vinted" },
  { title: "Funko POP! Moment – Itachi (Susano'o)", paid: 38, sale: 120, profit: 82, date: "2025-10-21", platform: "Vinted" },
  { title: "Salomon – XT-6 GTX Antelope / Icicle / Portabella", paid: 92.50, sale: 155, profit: 62.50, date: "2025-10-22", platform: "Vinted" },
  { title: "Pop Mart Hirono Living", paid: 32.40, sale: 28, profit: -4.40, date: "2025-10-29", platform: "Vinted" },
  { title: "Salomon Speedcross 3 VANDYTHEPINK", paid: 70, sale: 100, profit: 30, date: "2025-10-29", platform: "Vinted" },
  { title: "STORY MFG. x GEL-VENTURE 6", paid: 140, sale: 157, profit: 17, date: "2025-10-29", platform: "Vinted" },
  { title: "Funko POP! Jumbo Pokémon – Raikou", paid: 38, sale: 42, profit: 4, date: "2025-10-29", platform: "Vinted" },
  { title: "Pop Mart Have a Seat Box Vert", paid: 20, sale: 28, profit: 8, date: "2025-10-29", platform: "Vinted" },
  { title: "Pop Mart Big Into Whole Box", paid: 120, sale: 130, profit: 10, date: "2025-10-29", platform: "Vinted" },
  { title: "LEGO Aventure en Transylvanie V29", paid: 350, sale: 455, profit: 105, date: "2025-11-18", platform: "Vinted" },
  { title: "Salomon – XT-6 GTX White/White/Ftw Silver", paid: 100, sale: 155, profit: 55, date: "2025-11-18", platform: "Vinted" },
  { title: "Onyx 5.0 Seamless T-Shirt", paid: 61, sale: 74.99, profit: 13.99, date: "2025-11-18", platform: "Vinted" },
  { title: "Salomon XT-6 Dark Blue-Almond Milk-Asphalt", paid: 105, sale: 140, profit: 35, date: "2025-11-18", platform: "Vinted" },
  { title: "Salomon xt 6 mahogany rose earth brown", paid: 115.16, sale: 145, profit: 29.84, date: "2025-11-18", platform: "Vinted" },
  { title: "SALOMON XT-6 Cathay Spice", paid: 90, sale: 135, profit: 45, date: "2025-11-18", platform: "Vinted" },
  { title: "New Balance Purple 740CG2", paid: 78, sale: 99.99, profit: 21.99, date: "2025-11-18", platform: "Vinted" },
  { title: "adidas Originals x ASOS - Veste de survêtement Fleur", paid: 145.99, sale: 155, profit: 9.01, date: "2025-11-18", platform: "Vinted" },
  { title: "Pop Mart Hirono Living", paid: 32.40, sale: 27, profit: -5.40, date: "2025-11-18", platform: "Vinted" },
  { title: "Funko POP! Jumbo Pokémon – Raikou", paid: 38, sale: 47, profit: 9, date: "2025-11-18", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 152, profit: 48, date: "2025-11-18", platform: "Vinted" },
  { title: "RC 1:64 Nissan Skyline R32 Pandem Vehicle", paid: 57, sale: 119.99, profit: 62.99, date: "2025-11-18", platform: "Vinted" },
  { title: "RC 1:64 Nissan Skyline R32 Pandem Vehicle", paid: 57, sale: 129.99, profit: 72.99, date: "2025-11-18", platform: "Vinted" },
  { title: "Barbie Día De Muertos La Llorona Doll", paid: 120, sale: 320, profit: 200, date: "2025-11-18", platform: "Vinted" },
  { title: "SALOMON XT-6 Cathay Spice", paid: 90, sale: 125, profit: 35, date: "2025-11-18", platform: "Vinted" },
  { title: "Funko POP! Jumbo Pokémon – Raikou", paid: 38, sale: 42, profit: 4, date: "2025-11-18", platform: "Vinted" },
  { title: "THE LIFE OF A SHOWGIRL Vinyl Golden", paid: 34.99, sale: 58, profit: 23.01, date: "2025-11-18", platform: "Vinted" },
  { title: "Pop Mart Hirono Living", paid: 32.40, sale: 29.99, profit: -2.41, date: "2025-11-18", platform: "Vinted" },
  { title: "Pop Mart Big Into Whole Box", paid: 120, sale: 125.99, profit: 5.99, date: "2025-11-24", platform: "Vinted" },
  { title: "Hot Wheels x Daniel Arsham – Porsche 911 RSA 1973", paid: 0, sale: 64, profit: 64, date: "2025-11-24", platform: "Vinted" },
  { title: "Hot Wheels x Daniel Arsham – Porsche 911 RSA 1973", paid: 0, sale: 69.99, profit: 69.99, date: "2025-11-24", platform: "Vinted" },
  { title: "Barbie Golden Dream Christie Doll", paid: 0, sale: 75, profit: 75, date: "2025-11-24", platform: "Vinted" },
  { title: "GLENN MARTENS H&M SAC BANDOULIÈRE", paid: 90, sale: 116, profit: 26, date: "2025-11-24", platform: "Vinted" },
  { title: "Salomon xt 6 black ftw silver warm apricot", paid: 130, sale: 135, profit: 5, date: "2025-11-24", platform: "Vinted" },
  { title: "The Life of a Showgirl Tumbler", paid: 59, sale: 69.99, profit: 10.99, date: "2025-11-24", platform: "Vinted" },
  { title: "The Life of a Showgirl Vinyl Case", paid: 103, sale: 170, profit: 67, date: "2025-11-24", platform: "Vinted" },
  { title: "SALOMON XT-6 GTX BLACK / BLACK / SILVER", paid: 100, sale: 145, profit: 45, date: "2025-12-08", platform: "Vinted" },
  { title: "THE LIFE OF A SHOWGIRL Vinyl Golden", paid: 34.99, sale: 59.99, profit: 25, date: "2025-12-08", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 140, profit: 36, date: "2025-12-08", platform: "Vinted" },
  { title: "Salomon – XT-6 Vanilla Ice / Iron / Etherea", paid: 104, sale: 140, profit: 36, date: "2025-12-08", platform: "Vinted" },
  { title: "Salomon XT-6 Bright Vert", paid: 111.73, sale: 125, profit: 13.27, date: "2025-12-08", platform: "Vinted" },
  { title: "SALOMON XT-6 Cathay Spice", paid: 90, sale: 135, profit: 45, date: "2025-12-08", platform: "Vinted" },
  { title: "Legami Milano – Calendrier de l'Avent", paid: 45, sale: 70, profit: 25, date: "2025-12-08", platform: "Vinted" },
  { title: "Legami Milano – Calendrier de l'Avent", paid: 45, sale: 60, profit: 15, date: "2025-12-08", platform: "Vinted" },
  { title: "RC 1:64 Nissan Skyline R32 Pandem Vehicle", paid: 57, sale: 110, profit: 53, date: "2025-12-08", platform: "Vinted" },
  { title: "LEGO Aventure en Transylvanie V29", paid: 350, sale: 380, profit: 30, date: "2025-12-08", platform: "Vinted" },
  { title: "Displate – Nuka Cherry Girl Limited Edition", paid: 139, sale: 160, profit: 21, date: "2025-12-08", platform: "Vinted" },
  { title: "Nike Air Max 95 Corteiz Honey Black", paid: 202.99, sale: 210, profit: 7.01, date: "2025-12-08", platform: "Vinted" },
  { title: "Pop Mart Hirono Living", paid: 32.40, sale: 27, profit: -5.40, date: "2025-12-08", platform: "Vinted" },
  { title: "The Life of a Showgirl Tumbler", paid: 50, sale: 62, profit: 12, date: "2025-12-08", platform: "Vinted" },
  { title: "Folklore Album Cardigan Plush Cat", paid: 49, sale: 199.99, profit: 150.99, date: "2025-12-08", platform: "Vinted" },
  { title: "Monster High Skullector The Shining Grady Twins", paid: 105, sale: 275, profit: 170, date: "2025-12-08", platform: "Vinted" },
]

const pokemonSeriesData = [
  { name: "EV8.5 Évolutions Prismatiques", code: "EV8.5", color: "#9B59B6", order: 1 },
  { name: "EV11 Flamme Noir & Blanche", code: "EV11", color: "#1C1C1C", order: 2 },
  { name: "EV10 Destinées de Paldea", code: "EV10", color: "#3498DB", order: 3 },
  { name: "Écarlate et Violet", code: "SV", color: "#E74C3C", order: 4 },
  { name: "Coffrets Premium", code: "PREMIUM", color: "#F39C12", order: 5 },
  { name: "UPC (Ultra Premium Collection)", code: "UPC", color: "#E67E22", order: 6 },
]

const stockProducts = [
  // ========== POKEMON (Stock CSV + Amazon CSV) ==========
  // Stock CSV - Coffrets Super Premium
  { title: "Coffret Pokémon Super-Premium EV8.5 Évolutions Prismatiques", purchasePrice: 119, category: "Pokemon", pokemonSeries: "Coffrets Premium", purchaseDate: "2025-05-22", dateHome: "2025-09-29" },
  { title: "Coffret Pokémon Super-Premium EV8.5 Évolutions Prismatiques", purchasePrice: 130, category: "Pokemon", pokemonSeries: "Coffrets Premium", purchaseDate: "2025-05-22", dateHome: "2025-09-29" },
  // Stock CSV - ETB Flamme Noir (x7)
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  // Stock CSV - ETB Flamme Blanche (x3)
  { title: "ETB Flamme Blanche", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Blanche", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Blanche", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV11 Flamme Noir & Blanche", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  // Amazon CSV - ETB EV 8.5 (Évolutions Prismatiques) - Expédiés
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "feyaffricayexpm@yvora.fr", amazonOrderId: "171-5182797-5403531" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "cellesonnieprvee@yvora.fr", amazonOrderId: "171-7767820-2965951" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-17", dateHome: null, amazonEmail: "aliemurcfxff@yvora.fr" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-17", dateHome: null, amazonEmail: "alizao'mearaakjxt@yvora.fr" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-25", dateHome: null, amazonEmail: "ruthanndowneseqpfs@yvora.fr" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-25", dateHome: null, amazonEmail: "annaliseaureleacnyns@yvora.fr" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-25", dateHome: null, amazonEmail: "malindasamarayncdd@yvora.fr" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-25", dateHome: null, amazonEmail: "laurenebarbezqmjg@yvora.fr" },
  { title: "ETB EV 8.5 Évolutions Prismatiques", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "EV8.5 Évolutions Prismatiques", purchaseDate: "2025-10-29", dateHome: null, amazonEmail: "philiscarasbbtfo@yvora.fr" },
  // Amazon CSV - ETB Gardevoir - Expédiés
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "jodypegamwstw@yvora.fr", amazonOrderId: "171-8977433-0157150" },
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "tiffanisollowswjiga@yvora.fr", amazonOrderId: "171-0547802-1557124" },
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "geriannamaynardnamvh@yvora.fr", amazonOrderId: "171-0628735-3416357" },
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "virgieangelecgtfk@yvora.fr" },
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-11", dateHome: null, amazonEmail: "3@yvora.fr" },
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-17", dateHome: null, amazonEmail: "nikefarrisonasnly@yvora.fr" },
  { title: "ETB Gardevoir", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-17", dateHome: null, amazonEmail: "41@yvora.fr" },
  // Amazon CSV - ETB Lucario - Expédiés
  { title: "ETB Lucario", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-21", dateHome: null, amazonEmail: "tanijacquelynauzkx@yvora.fr" },
  { title: "ETB Lucario", purchasePrice: 55.99, category: "Pokemon", pokemonSeries: "Écarlate et Violet", purchaseDate: "2025-10-16", dateHome: null, amazonEmail: "10@yvora.fr" },
  // Amazon CSV - UPC Dracaufeu (UPS DARCOFEU) - Payés mais pas expédiés
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "tamikoadeywzoxm@yvora.fr" },
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "catherinainnesgntjb@yvora.fr" },
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "maddykarelwhkdo@yvora.fr" },
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "hephzibahingramsgzvg@yvora.fr" },
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "korecristobalwcnys@yvora.fr" },
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "annaliseaureleacnyns@yvora.fr" },
  { title: "UPC Dracaufeu (Charizard)", purchasePrice: 154.99, category: "Pokemon", pokemonSeries: "UPC (Ultra Premium Collection)", purchaseDate: "2025-11-15", dateHome: null, amazonEmail: "korecristobalwcnys@yvora.fr" },
  
  // ========== POP MART ==========
  { title: "Pop Mart - MOLLY – Peekaboo", purchasePrice: 72, category: "Pop Mart", purchaseDate: "2025-06-12", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry x1 boite", purchasePrice: 16.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry Whole Set", purchasePrice: 100.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry Whole Set", purchasePrice: 100.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry Whole Set", purchasePrice: 100.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Beige", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Bleu", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Vert", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Beige", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Gris", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Marron", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Rare", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Big into Energy Box Vert", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Have a Seat Box Violet", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Have a Seat Box Gris", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Have a Seat Box Beige", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Fall in Wild", purchasePrice: 28.80, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Fall in Wild", purchasePrice: 28.80, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Hacipupu Whole Box", purchasePrice: 137, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-09", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-09", dateHome: "2025-09-29" },
  
  // ========== SNEAKERS ==========
  { title: "Salomon XT-6 White Fairy Tale Almond Milk", purchasePrice: 100.76, category: "Sneakers", subcategory: "43 1/3", purchaseDate: "2025-07-13", dateHome: "2025-09-29" },
  { title: "New Balance 740CG2 Purple", purchasePrice: 78, category: "Sneakers", subcategory: "39.5", purchaseDate: "2025-07-25", dateHome: "2025-09-29" },
  
  // ========== LORCANA ==========
  { title: "Disney Lorcana: The First Chapter Booster Display", purchasePrice: 144, category: "Lorcana", purchaseDate: "2025-07-10", dateHome: "2025-09-29" },
  { title: "Disney Lorcana: The First Chapter Booster Display", purchasePrice: 144, category: "Lorcana", purchaseDate: "2025-07-10", dateHome: "2025-09-29" },
  
  // ========== MATTEL ==========
  { title: "Monster High Skullector - The Shining Grady Twins", purchasePrice: 105, category: "Mattel", purchaseDate: "2025-11-16", dateHome: null },
  { title: "UNO Canvas Billie Eilish", purchasePrice: 25, category: "Mattel", purchaseDate: "2025-12-24", dateHome: null },
  { title: "UNO Canvas Billie Eilish", purchasePrice: 25, category: "Mattel", purchaseDate: "2025-12-24", dateHome: null },
  { title: "Monster High Skullector - Edward Scissorhands Doll", purchasePrice: 72, category: "Mattel", purchaseDate: "2025-12-24", dateHome: null },
  { title: "Monster High Skullector - Edward Scissorhands Doll", purchasePrice: 72, category: "Mattel", purchaseDate: "2025-12-24", dateHome: null },
  { title: "Yzma - The Emperor's New Groove 25th Anniversary", purchasePrice: 134, category: "Mattel", purchaseDate: "2025-12-24", dateHome: null },
  
  // ========== FUNKO ==========
  { title: "FUNKO POP! - IRON MAN", purchasePrice: 30, category: "Funko", purchaseDate: "2025-12-24", dateHome: null },
  { title: "FUNKO POP! ED LIMITEE SUPREME - ONE PIECE - Sanji WCI", purchasePrice: 24.99, category: "Funko", purchaseDate: "2025-12-24", dateHome: null },
  
  // ========== ACCESSOIRES ==========
  { title: "KAWS Chul-Su Figure (Coloured)", purchasePrice: 460, category: "Accessoires", purchaseDate: "2025-07-13", dateHome: "2025-09-29" },
  { title: "United States Mint - 250th Anniversary United States Navy", purchasePrice: 110, category: "Accessoires", purchaseDate: "2025-10-29", dateHome: "2025-10-29" },
  { title: "Ensemble de pin's Winnie l'Ourson et Éfélant", purchasePrice: 35, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: "2025-11-18" },
  { title: "Folklore Album Cardigan Plush Cat (Taylor Swift)", purchasePrice: 49, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "Folklore Album Cardigan Plush Cat (Taylor Swift)", purchasePrice: 49, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "Folklore Album Cardigan Plush Cat (Taylor Swift)", purchasePrice: 49, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "The Life of a Showgirl Vinyl Case (Taylor Swift)", purchasePrice: 103, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "Magic The Gathering Chocobo Bundle Final Fantasy", purchasePrice: 114.99, category: "Accessoires", purchaseDate: "2025-12-24", dateHome: "2025-12-26" },
  
  // ========== VÊTEMENTS ==========
  { title: "Adidas Originals x ASOS - Veste de survêtement Fleur", purchasePrice: 145.99, category: "Vêtements", subcategory: "S", purchaseDate: "2025-07-18", dateHome: "2025-09-29" },
]

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  await prisma.sale.deleteMany()
  await prisma.amazonOrder.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.pokemonSeries.deleteMany()

  // Create categories
  const categories = [
    { name: "Pokemon", color: "#FFCB05", icon: "pokemon" },
    { name: "Pop Mart", color: "#FF6B9D", icon: "toy" },
    { name: "Sneakers", color: "#4ECDC4", icon: "shoe" },
    { name: "Lorcana", color: "#1ABC9C", icon: "cards" },
    { name: "Mattel", color: "#E74C3C", icon: "doll" },
    { name: "Funko", color: "#9B59B6", icon: "figure" },
    { name: "Accessoires", color: "#E67E22", icon: "accessory" },
    { name: "Vêtements", color: "#3498DB", icon: "clothing" },
    { name: "Autres", color: "#95A5A6", icon: "box" },
  ]

  for (const cat of categories) {
    await prisma.category.create({ data: cat })
  }
  console.log(`✅ Created ${categories.length} categories`)

  // Create Pokemon series
  for (const series of pokemonSeriesData) {
    await prisma.pokemonSeries.create({ data: series })
  }
  console.log(`✅ Created ${pokemonSeriesData.length} Pokemon series`)

  // Create products
  for (const product of stockProducts) {
    const p = product as { 
      title: string
      purchasePrice: number
      category: string
      purchaseDate: string
      dateHome: string | null
      subcategory?: string
      amazonEmail?: string
      amazonOrderId?: string
      pokemonSeries?: string
    }
    await prisma.product.create({
      data: {
        title: p.title,
        purchasePrice: p.purchasePrice,
        totalCost: p.purchasePrice,
        sellingPrice: Math.round(p.purchasePrice * 1.4),
        category: p.category,
        subcategory: p.subcategory || null,
        status: "in_stock",
        condition: "new_with_tags",
        purchaseDate: p.purchaseDate ? new Date(p.purchaseDate) : null,
        dateHome: p.dateHome ? new Date(p.dateHome) : null,
        amazonEmail: p.amazonEmail || null,
        amazonOrderId: p.amazonOrderId || null,
        pokemonSeries: p.pokemonSeries || null,
      },
    })
  }
  console.log(`✅ Created ${stockProducts.length} products`)

  // Create sales (with dummy products for sold items)
  for (const sale of salesData) {
    // Create a sold product for each sale
    const soldProduct = await prisma.product.create({
      data: {
        title: sale.title,
        purchasePrice: sale.paid,
        totalCost: sale.paid,
        sellingPrice: sale.sale,
        category: "Autres",
        status: "sold",
        condition: "new_with_tags",
        purchaseDate: new Date(sale.date),
      },
    })

    // Create the sale record
    await prisma.sale.create({
      data: {
        productId: soldProduct.id,
        finalPrice: sale.sale,
        platformFees: 0,
        shippingCost: 0,
        netProfit: sale.profit,
        platform: sale.platform,
        saleDate: new Date(sale.date),
      },
    })
  }
  console.log(`✅ Created ${salesData.length} sales`)

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
