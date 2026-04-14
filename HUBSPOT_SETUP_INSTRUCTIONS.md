# 🔧 Configuración Requerida de HubSpot

## Problema Detectado
Tu API key actual **no tiene permisos de escritura de schema**. Puedes leer datos pero no crear/actualizar campos.

## Solución: Actualizar Permisos de tu Private App

### Pasos:

1. **Ve a tu HubSpot**
   - Ir a `Settings` (⚙️) → `Integrations` → `Private Apps`
   - O directamente: https://app.hubspot.com/private-apps/51334831

2. **Edita tu app "JHI Chat Integration"** (o la que estés usando)

3. **Agrega estos scopes adicionales:**
   
   En la sección de **CRM** → **Schema**, asegúrate de tener marcados:
   
   ✅ `crm.schemas.contacts.write` - Para crear campos en Contactos
   ✅ `crm.schemas.deals.write` - Para crear campos en Deals/Cotizaciones
   ✅ `crm.schemas.companies.write` - Para crear campos en Empresas
   
   También verifica que tengas:
   ✅ `crm.objects.contacts.write` - Ya deberías tenerlo
   ✅ `crm.objects.deals.write` - Ya deberías tenerlo
   ✅ `crm.objects.companies.write` - Para empresas

4. **Guarda los cambios**

5. **Regenera el token** (si es necesario)
   - A veces necesitas regenerar el token después de cambiar scopes
   - Si lo regeneras, actualiza tu `.env.local`

6. **Verifica la configuración**
   Ejecuta: `node create-hubspot-fields.mjs`

## Campos que se Crearán Automáticamente

Una vez tengas los permisos correctos, el script creará:

### En Deals/Cotizaciones (object 0-3):
- ✅ `estado_cotizacion` - Enum con 7 estados
- ✅ `fechaenviocotizacion` - Fecha de envío
- ✅ `tipoclienteoperacion` - Enum (cliente_directo, otro_broker)
- ✅ `puerto_salida` - Texto
- ✅ `mercado_origen` - Texto

### En Contacts (object 0-1):
- ✅ `rolenla_operacion` - Enum (comprador, broker, logistica, finanzas, otro)

## Campos que Ya Existen:
- ✅ `incoterm` - Ya configurado [fob, cif, cfr, exw, otro]
- ✅ `producto_cotizado` - Ya configurado [azucar, chicken_paws, otro]

## Después de Configurar los Permisos

Ejecuta estos comandos para verificar:

```bash
node create-hubspot-fields.mjs
node verify-hubspot.mjs
```

Deberías ver todos los campos creados exitosamente.
