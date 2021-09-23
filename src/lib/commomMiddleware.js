import middy from "@middy/core"
import httpJsonBodyParser from "@middy/http-json-body-parser"
import httpEventNormalizer from "@middy/http-event-normalizer"
import httpErrorHandler from "@middy/http-error-handler"

export default handler => middy(handler).use([
    httpJsonBodyParser(), //automaticamente ele faz o parse no nosso evento json
    httpEventNormalizer(), //ajusta o evento no API GAteway para evitar objetos que não existem 
    httpErrorHandler(), //ajuda a lidar com erros
])