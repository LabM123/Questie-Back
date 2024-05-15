import MercadoPagoConfig from "mercadopago";

export const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})