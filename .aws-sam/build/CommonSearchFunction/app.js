const axios = require("axios").default;
const { ready, transform, prettyPrint } = require("camaro");

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.commonSearch = async (event, context) => {
  try {
    await ready();
    const axesorResponse = await axios.get(`${process.env.AXESOR_API_URL}`, {
      params: {
        accion: 3,
        nombreSociedad: event.queryStringParameters.nombreSociedad,
        sociedades: 1,
        autónomos: 1,
        ejecutivos: 1,
      },
    });

    const result = await transform(axesorResponse.data, getTemplate());

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify(result, null, 2),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getTemplate = () => ({
  cache_key: "/ServicioWebAxesor/ListaPaquetesNegocio/ListaSociedades",
  sociedades: [
    "//Sociedad",
    {
      rank: "@Rank",
      codInfotel: "@CodInfotel",
      isMercantil: "boolean(@EsMercantil = 'True')",
      name: "NombreSociedad",
      coincidenceBy: "CoincidenciaPor",
      textCoincidenceBy: "TextoCoincidencia",
      coincidenceBy: "ListaNombresCoincidentes",

      coincidenceNameList: [
        "ListaNombresCoincidentes",
        {
          coincidenceName: "NombreCoincidente",
        },
      ],

      province: "Provincia",
      filteredName: "NombreFiltrado",
      slashLong: "LongitudBarra",
      registralData: "DatosRegistrales",
    },
  ],
});
