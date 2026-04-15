import Link from "next/link";
import { ArrowRight, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Panel Administrativo JHI
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Sistema de gestión operativa de cotizaciones
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Cotizaciones Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TableIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Cotizaciones</CardTitle>
              </div>
              <CardDescription>
                Gestión completa de cotizaciones con edición inline y filtros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/cotizaciones">
                <Button className="w-full">
                  Abrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Future modules can be added here */}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Información del Sistema
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Características Implementadas
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Tabla de cotizaciones con edición inline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>7 vistas preconfiguradas por estado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Filtros avanzados múltiples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Sincronización bidireccional con HubSpot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Validación de reglas de negocio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Logging de cambios para auditoría</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Campos Operativos
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• tipodeproceso</li>
                <li>• estadodelsuplidor</li>
                <li>• fechasolicituda_suplidor</li>
                <li>• fecharespuestadel_suplidor</li>
                <li>• estadodela_cotizacion</li>
                <li>• trial_solicitado</li>
                <li>• resultadodela_cotizacion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
