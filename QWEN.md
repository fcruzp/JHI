## Qwen Added Memories
- ## Phase 4 Admin Panel - HubSpot Property Names Mapping

The 7 operational fields for the Admin Panel use these HubSpot property names (with underscores):

| TypeScript Type | HubSpot Property Name | Enum Values |
|----------------|----------------------|-------------|
| tipodeproceso | tipo_de_proceso | cotizacion, oportunidad_trial |
| estadodelsuplidor | estado_del_suplidor | pendiente_por_contactar, contactado, esperando_valores, valores_recibidos |
| fechasolicituda_suplidor | fecha_solicitud_a_suplidor | date (YYYY-MM-DD) |
| fecharespuestadel_suplidor | fecha_respuesta_del_suplidor | date (YYYY-MM-DD) |
| estadodela_cotizacion | estado_de_la_cotizacion | solicitud_recibida, en_preparacion, enviada, en_revision_del_cliente, aprobada_para_trial, rechazada |
| trial_solicitado | trial_solicitado | boolean (true/false) |
| resultadodela_cotizacion | resultado_de_la_cotizacion | pendiente, ganada_para_continuar, perdida |

IMPORTANT: HubSpot uses underscores in property names (tipo_de_proceso) NOT camelCase (tipodeproceso).
Enum values also use underscores (pendiente_por_contactar) NOT concatenated (pendienteporcontactar).

All 7 fields already exist in HubSpot custom object 0-3 (Cotizaciones).
