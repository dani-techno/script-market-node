/*
 * Flowix Open Source Project
 *
 * Copyright (c) 2026
 * PT Inovixa Technologies Solution
 * Author: Tn. Dani Joest, S.M.T., C.P.M. (Full-Stack Software Engineer)
 *
 * Lisensi: MIT License
 * Repository: Open Source
 *
 * Izin diberikan kepada siapa pun untuk menggunakan, menyalin, memodifikasi,
 * dan mendistribusikan kode ini sesuai dengan ketentuan MIT License.
 *
 * Perangkat lunak ini disediakan "SEBAGAIMANA ADANYA", tanpa jaminan apa pun.
 * Penulis dan pemegang hak cipta tidak bertanggung jawab atas kerusakan atau
 * kerugian yang timbul dari penggunaan perangkat lunak ini.
 */

require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 3000,
    },
    api: {
        baseUrl: process.env.API_BASE_URL,
        key: process.env.API_KEY,
        merchantId: process.env.MERCHANT_ID,
    },
    product: {
        title: process.env.PRODUCT_TITLE,
        description: process.env.PRODUCT_DESC,
        price: parseInt(process.env.PRODUCT_PRICE),
        imageUrl: '/images/product.jpg', // Ensure asset exists in public/images
        downloadUrl: process.env.DOWNLOAD_URL,
    }
};