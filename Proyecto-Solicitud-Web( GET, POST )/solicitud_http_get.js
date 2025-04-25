const https = require('https');

// URL de una API pública (ej: API de gatos)
const url = 'https://api.thecatapi.com/v1/images/search';

https.get(url, (res) => {
    let data = '';
    console.log('Código de estado:', res.statusCode, res.statusMessage);

    // Se recibe un fragmento de datos
    res.on('data', (texto_api) => {
        data += texto_api;
    });

    // Toda la respuesta ha sido recibida
    res.on('end', () => {
        const resultado = JSON.parse(data);
        console.log('Respuesta de la API:\n', resultado);
    });

}).on("error", (err) => {
    console.error("Error en la solicitud:", err.message);
});
