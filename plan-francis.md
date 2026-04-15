Historial de Comunicaciones en HubSpot y Contexto para Chatbot
Este plan detalla cómo guardar cada correo enviado manualmente como una "Nota" en HubSpot asociada a la cotización, y cómo recuperar ese historial para que el chatbot tenga contexto completo al hablar con el cliente.

User Review Required
IMPORTANT

Para recuperar las notas, haremos una llamada adicional a HubSpot en el flujo del chatbot. Esto garantiza que el chatbot sepa exactamente qué le ha dicho el equipo administrativo al cliente recientemente.

Proposed Changes
[Service Layer]
[MODIFY] 
service.ts
Refactorización de associateObjects: Permitir pasar el ID del tipo de asociación en lugar de tener uno fijo.
Nuevo Método ActivitiesService.getNotesByCotizacionId:
Recupera los IDs de las notas asociadas al objeto 0-3.
Realiza una carga por lote (batch) de los cuerpos de las notas (hs_note_body) y sus fechas.
[Admin / Email Flow]
[MODIFY] 
route.ts
Tras el envío exitoso del correo, llamar a HubSpotService.activities.createNote.
El cuerpo de la nota incluirá el prefijo [CORREO ADMIN] para que sea fácilmente identificable en HubSpot y por el chatbot.
[Chatbot Logic]
[MODIFY] 
route.ts
Actualización de checkQuoteStatus:
Si el cliente proporciona un número de referencia o si solo hay una cotización activa para su correo:
Recuperar las notas asociadas a esa cotización específica.
Incluir el contenido de las últimas notas en el contexto enviado a Gemini.
Si hay múltiples cotizaciones, el bot las listará primero y pedirá al cliente especificar sobre cuál desea más detalle (usando la inteligencia natural de Gemini para guiar la conversación).
Esto garantiza que el bot no mezcle información de diferentes pedidos y sea ultra-preciso.
Verification Plan
Manual Verification
Enviar Correo: Desde el panel administrador, enviar una actualización ("El precio del azúcar ha bajado 5 USD").
Verificar HubSpot: Entrar en HubSpot y verificar que la nota aparece en el timeline de la Cotización (0-3).
Conversar con Chatbot:
Como cliente, preguntar al chatbot: "¿Cuál es el estatus de mi cotización de azúcar?".
El chatbot ahora debería mencionar la información enviada en el último correo manual.
Verificar Logs: Confirmar que no hay errores de asociación en la terminal.


[ ] Update HubSpotService (service.ts): Add getNotesByCotizacionId and refactor associateObjects.
[ ] Update send-update API: Persist manual email as a note in HubSpot.
[ ] Update chat API: Include associated notes in checkQuoteStatus summary for specific quotes.
[ ] Verify: Check HubSpot notes after sending email and test chatbot's response with the new context.