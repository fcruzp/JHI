"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ESTADO_SUPLIDOR_LABELS,
  ESTADO_OPERATIVO_LABELS,
  RESULTADO_COTIZACION_LABELS,
  TIPO_PROCESO_LABELS,
  PRODUCTO_LABELS,
  DEALSTAGE_LABELS,
  EstadoDelSuplidor,
  EstadoOperativoCotizacion,
  ResultadoDeCotizacion,
  TipoDeProceso,
} from "@/lib/hubspot";
import { ChevronDown, Filter, RefreshCw, Search, Trash2, X, AlertTriangle, Send, Sparkles, Languages, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ============================================================
// Types
// ============================================================

interface Cotizacion {
  id: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  properties: Record<string, string | null>;
}

interface FilterState {
  estadodelsuplidor: EstadoDelSuplidor[];
  estadodela_cotizacion: EstadoOperativoCotizacion[];
  resultadodela_cotizacion: ResultadoDeCotizacion[];
  trial_solicitado: boolean | undefined;
  tipodeproceso: TipoDeProceso[];
  fecha_solicitud_desde: string;
  fecha_solicitud_hasta: string;
  fecha_respuesta_desde: string;
  fecha_respuesta_hasta: string;
}

interface MetricsData {
  total: number;
  thisWeek: number;
  thisMonth: number;
  pendienteContactar: number;
  esperandoValores: number;
  valoresRecibidos: number;
  enviadas: number;
  conTrial: number;
  perdidas: number;
  convertidasTrial: number;
  ganadas: number;
}

interface CotizacionNote {
  body: string;
  createdAt: string;
}

// ============================================================
// Preconfigured Views
// ============================================================

const PRECONFIGURED_VIEWS = [
  {
    name: "Pendientes por contactar",
    filters: { estadodelsuplidor: ["pendiente_por_contactar"] } as Partial<FilterState>,
  },
  {
    name: "Esperando valores",
    filters: { estadodelsuplidor: ["esperando_valores"] } as Partial<FilterState>,
  },
  {
    name: "Listas para preparar",
    filters: { estadodelsuplidor: ["valores_recibidos"] } as Partial<FilterState>,
  },
  {
    name: "Cotizaciones enviadas",
    filters: { estadodela_cotizacion: ["enviada"] } as Partial<FilterState>,
  },
  {
    name: "Con trial solicitado",
    filters: { trial_solicitado: true } as Partial<FilterState>,
  },
  {
    name: "Perdidas",
    filters: { resultadodela_cotizacion: ["perdida"] } as Partial<FilterState>,
  },
  {
    name: "Convertidas a trial",
    filters: { tipodeproceso: ["oportunidad_trial"] } as Partial<FilterState>,
  },
];

// ============================================================
// Helper Functions
// ============================================================

function getStatusColor(
  estado: string,
  type: "suplidor" | "operativo" | "resultado"
): string {
  const pendingStates = ["pendiente_por_contactar", "esperando_valores", "solicitud_recibida", "pendiente"];
  const progressStates = ["contactado", "en_preparacion", "en_revision_del_cliente"];
  const successStates = ["valores_recibidos", "enviada", "ganada_para_continuar"];
  const errorStates = ["rechazada", "perdida"];

  if (type === "suplidor") {
    if (pendingStates.includes(estado)) return "bg-yellow-500";
    if (progressStates.includes(estado)) return "bg-blue-500";
    if (successStates.includes(estado)) return "bg-green-500";
    return "bg-gray-500";
  }

  if (type === "operativo") {
    if (pendingStates.includes(estado)) return "bg-yellow-500";
    if (progressStates.includes(estado)) return "bg-blue-500";
    if (successStates.includes(estado)) return "bg-green-500";
    if (errorStates.includes(estado)) return "bg-red-500";
    return "bg-gray-500";
  }

  if (type === "resultado") {
    if (estado === "ganada_para_continuar") return "bg-green-500";
    if (estado === "perdida") return "bg-red-500";
    return "bg-yellow-500";
  }

  return "bg-gray-500";
}

// ============================================================
// Main Component
// ============================================================

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState<{ next?: { after?: string } } | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
  } | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [totalFiltered, setTotalFiltered] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    estadodelsuplidor: [],
    estadodela_cotizacion: [],
    resultadodela_cotizacion: [],
    trial_solicitado: undefined,
    tipodeproceso: [],
    fecha_solicitud_desde: "",
    fecha_solicitud_hasta: "",
    fecha_respuesta_desde: "",
    fecha_respuesta_hasta: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);
  const [updateComment, setUpdateComment] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState<CotizacionNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Debounce search query
  const handleProcessAI = async (action: string) => {
    if (!updateComment.trim()) {
      toast.error("Escribe un mensaje primero");
      return;
    }

    setIsProcessingAI(true);
    try {
      const response = await fetch("/api/admin/ai/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: updateComment, action }),
      });

      const data = await response.json();
      if (data.processedText) {
        setUpdateComment(data.processedText);
        toast.success("Texto procesado con IA");
      } else {
        toast.error(data.error || "Error al procesar con IA");
      }
    } catch (error) {
      toast.error("Error de conexión con el servicio de IA");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSendUpdate = async () => {
    if (!updateComment.trim()) {
      toast.error("El mensaje no puede estar vacío");
      return;
    }

    setIsSendingUpdate(true);
    try {
      const response = await fetch("/api/admin/cotizaciones/send-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDetail.id,
          comentario: updateComment,
          estadoLabel: DEALSTAGE_LABELS[selectedDetail.properties.dealstage?.toLowerCase()] || selectedDetail.properties.dealstage,
          email: selectedDetail.contact?.email,
          nombre: `${selectedDetail.contact?.firstname || ''} ${selectedDetail.contact?.lastname || ''}`.trim() || 'Cliente',
          producto: PRODUCTO_LABELS[selectedDetail.properties.producto_cotizado] || selectedDetail.properties.producto_cotizado,
          incoterm: selectedDetail.properties.incoterm,
          cantidad: selectedDetail.properties.amount
        }),
      });

      if (response.ok) {
        toast.success("Actualización enviada correctamente");
        setIsUpdateModalOpen(false);
        setUpdateComment("");
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al enviar la actualización");
      }
    } catch (error) {
      toast.error("Error de red al enviar el correo");
    } finally {
      setIsSendingUpdate(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ============================================================
  // Fetch Metrics
  // ============================================================

  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const response = await fetch("/api/admin/metrics");
      const data = await response.json();

      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // ============================================================
  // Fetch Cotizaciones
  // ============================================================

  const fetchCotizaciones = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Add filters
      if (filters.estadodelsuplidor.length > 0) {
        params.set("estadodelsuplidor", filters.estadodelsuplidor.join(","));
      }
      if (filters.estadodela_cotizacion.length > 0) {
        params.set("estadodela_cotizacion", filters.estadodela_cotizacion.join(","));
      }
      if (filters.resultadodela_cotizacion.length > 0) {
        params.set("resultadodela_cotizacion", filters.resultadodela_cotizacion.join(","));
      }
      if (filters.trial_solicitado !== undefined) {
        params.set("trial_solicitado", String(filters.trial_solicitado));
      }
      if (filters.tipodeproceso.length > 0) {
        params.set("tipodeproceso", filters.tipodeproceso.join(","));
      }
      if (filters.fecha_solicitud_desde) {
        params.set("fecha_solicitud_desde", filters.fecha_solicitud_desde);
      }
      if (filters.fecha_solicitud_hasta) {
        params.set("fecha_solicitud_hasta", filters.fecha_solicitud_hasta);
      }
      if (filters.fecha_respuesta_desde) {
        params.set("fecha_respuesta_desde", filters.fecha_respuesta_desde);
      }
      if (filters.fecha_respuesta_hasta) {
        params.set("fecha_respuesta_hasta", filters.fecha_respuesta_hasta);
      }

      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      }

      params.set("limit", "100");
      if (paging && paging.next?.after && currentPage > 1) {
        params.set("after", paging.next.after);
      }

      const response = await fetch(`/api/admin/cotizaciones?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCotizaciones(data.data);
        setPaging(data.paging);
        setTotalFiltered(data.data.length);
      } else {
        toast.error("Error al cargar cotizaciones");
      }
    } catch (error) {
      console.error("Error fetching cotizaciones:", error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [filters, paging, currentPage, debouncedQuery]);

  useEffect(() => {
    fetchCotizaciones();
  }, [fetchCotizaciones]);

  // ============================================================
  // Handlers
  // ============================================================

  const handleApplyView = (viewFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      estadodelsuplidor: viewFilters.estadodelsuplidor || [],
      estadodela_cotizacion: viewFilters.estadodela_cotizacion || [],
      resultadodela_cotizacion: viewFilters.resultadodela_cotizacion || [],
      trial_solicitado: viewFilters.trial_solicitado ?? undefined,
      tipodeproceso: viewFilters.tipodeproceso || [],
    }));
    setCurrentPage(1);
    setTotalFiltered(null);
    fetchMetrics();
  };

  const updateField = async (
    id: string,
    field: string,
    value: string | boolean | null
  ) => {
    try {
      const response = await fetch("/api/admin/cotizaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          fields: { [field]: value },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Campo actualizado correctamente");
        
        // Show warnings if any
        if (data.warnings && data.warnings.length > 0) {
          data.warnings.forEach((warning: string) => {
            toast.info(warning, { duration: 5000 });
          });
        }
        
        setEditingCell(null);
        fetchCotizaciones();
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Error de conexión");
    }
  };

  const handleOpenDetail = (cotizacion: any) => {
    setSelectedDetail(cotizacion);
  };

  const loadCotizacionNotes = async (cotizacionId: string) => {
    setNotesLoading(true);
    try {
      const response = await fetch(`/api/admin/cotizaciones/${cotizacionId}/notes`);
      const data = await response.json();
      if (data.success) {
        setNotes(data.data || []);
      } else {
        toast.error(data.error || "No se pudieron cargar las notas");
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      toast.error("Error de red al cargar notas");
    } finally {
      setNotesLoading(false);
    }
  };

  const handleOpenNotesModal = async () => {
    if (!selectedDetail?.id) {
      toast.error("No hay cotización seleccionada");
      return;
    }

    setIsNotesModalOpen(true);
    await loadCotizacionNotes(selectedDetail.id);
  };

  const handleAddNote = async () => {
    if (!selectedDetail?.id) return;
    if (!newNote.trim()) {
      toast.error("Escribe una nota antes de guardar");
      return;
    }

    setAddingNote(true);
    try {
      const response = await fetch(`/api/admin/cotizaciones/${selectedDetail.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      const data = await response.json();
      if (data.success) {
        setNotes(data.data || []);
        setNewNote("");
        toast.success("Nota agregada correctamente");
      } else {
        toast.error(data.error || "No se pudo agregar la nota");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Error de red al guardar la nota");
    } finally {
      setAddingNote(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRows.size === 0) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/cotizaciones", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedRows) }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Se eliminaron ${selectedRows.size} cotizaciones`);
        setSelectedRows(new Set());
        fetchCotizaciones();
        fetchMetrics();
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error de conexión");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === cotizaciones.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(cotizaciones.map((c) => c.id)));
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Panel Administrativo - Cotizaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión operativa de cotizaciones sincronizadas con HubSpot
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cotización..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Views Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Vistas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {PRECONFIGURED_VIEWS.map((view) => (
                  <DropdownMenuItem
                    key={view.name}
                    onClick={() => handleApplyView(view.filters)}
                  >
                    {view.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filters Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>

            {/* Refresh */}
            <Button
              variant="outline"
              onClick={fetchCotizaciones}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estado del Suplidor */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado del Suplidor
                  </label>
                  <Select
                    value={filters.estadodelsuplidor.join(",")}
                    onValueChange={(value) => {
                      const values = value ? value.split(",") : [];
                      setFilters((prev) => ({
                        ...prev,
                        estadodelsuplidor: values as EstadoDelSuplidor[],
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ESTADO_SUPLIDOR_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Estado Cotización Operativo */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado Cotización (Operativo)
                  </label>
                  <Select
                    value={filters.estadodela_cotizacion.join(",")}
                    onValueChange={(value) => {
                      const values = value ? value.split(",") : [];
                      setFilters((prev) => ({
                        ...prev,
                        estadodela_cotizacion: values as EstadoOperativoCotizacion[],
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ESTADO_OPERATIVO_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Resultado */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resultado
                  </label>
                  <Select
                    value={filters.resultadodela_cotizacion.join(",")}
                    onValueChange={(value) => {
                      const values = value ? value.split(",") : [];
                      setFilters((prev) => ({
                        ...prev,
                        resultadodela_cotizacion: values as ResultadoDeCotizacion[],
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RESULTADO_COTIZACION_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trial Solicitado */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trial Solicitado
                  </label>
                  <Select
                    value={
                      filters.trial_solicitado === undefined
                        ? "all"
                        : String(filters.trial_solicitado)
                    }
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        trial_solicitado:
                          value === "all" ? undefined : value === "true",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Proceso */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Proceso
                  </label>
                  <Select
                    value={filters.tipodeproceso.join(",")}
                    onValueChange={(value) => {
                      const values = value ? value.split(",") : [];
                      setFilters((prev) => ({
                        ...prev,
                        tipodeproceso: values as TipoDeProceso[],
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIPO_PROCESO_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha Solicitud Desde */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha Solicitud (Desde)
                  </label>
                  <Input
                    type="date"
                    value={filters.fecha_solicitud_desde}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        fecha_solicitud_desde: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Fecha Solicitud Hasta */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha Solicitud (Hasta)
                  </label>
                  <Input
                    type="date"
                    value={filters.fecha_solicitud_hasta}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        fecha_solicitud_hasta: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        estadodelsuplidor: [],
                        estadodela_cotizacion: [],
                        resultadodela_cotizacion: [],
                        trial_solicitado: undefined,
                        tipodeproceso: [],
                        fecha_solicitud_desde: "",
                        fecha_solicitud_hasta: "",
                        fecha_respuesta_desde: "",
                        fecha_respuesta_hasta: "",
                      })
                    }
                    className="w-full"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Record Count */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalFiltered !== null ? (
                <>
                  Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{totalFiltered}</span> cotizaciones
                  {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "") && (
                    <>
                      {" "}de <span className="font-semibold text-gray-900 dark:text-gray-100">{metrics?.total || 0}</span> totales
                    </>
                  )}
                </>
              ) : loading ? (
                "Cargando..."
              ) : (
                "Sin registros"
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Actualizado: {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Metrics Dashboard */}
        {metrics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Resumen de Cotizaciones
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Total */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {metricsLoading ? "..." : metrics.total}
                </p>
              </div>

              {/* This Week */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Esta Semana</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {metricsLoading ? "..." : metrics.thisWeek}
                </p>
              </div>

              {/* This Month */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Este Mes</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {metricsLoading ? "..." : metrics.thisMonth}
                </p>
              </div>

              {/* Pending to Contact */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Por Contactar</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {metricsLoading ? "..." : metrics.pendienteContactar}
                </p>
              </div>

              {/* Waiting Values */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Enviadas a Suplidor</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {metricsLoading ? "..." : metrics.esperandoValores + metrics.valoresRecibidos}
                </p>
              </div>

              {/* Ready to Prepare */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Listas para Cotizar</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {metricsLoading ? "..." : metrics.valoresRecibidos}
                </p>
              </div>

              {/* Quotes Sent */}
              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cotizaciones Enviadas</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {metricsLoading ? "..." : metrics.enviadas}
                </p>
              </div>

              {/* With Trial */}
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Con Trial</p>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {metricsLoading ? "..." : metrics.conTrial}
                </p>
              </div>

              {/* Converted to Trial */}
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Convertidas a Trial</p>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {metricsLoading ? "..." : metrics.convertidasTrial}
                </p>
              </div>

              {/* Won */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Ganadas</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {metricsLoading ? "..." : metrics.ganadas}
                </p>
              </div>

              {/* Lost */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Perdidas</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {metricsLoading ? "..." : metrics.perdidas}
                </p>
              </div>

              {/* Pending */}
              <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {metricsLoading
                    ? "..."
                    : metrics.total -
                      metrics.ganadas -
                      metrics.perdidas -
                      metrics.convertidasTrial}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === cotizaciones.length && cotizaciones.length > 0}
                    onCheckedChange={toggleAllSelection}
                  />
                </TableHead>
                <TableHead>Nombre Cotización</TableHead>
                <TableHead>Tipo Proceso</TableHead>
                <TableHead>Estado Suplidor</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Fecha Respuesta</TableHead>
                <TableHead>Estado Cotización</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Actualizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : cotizaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No se encontraron cotizaciones
                  </TableCell>
                </TableRow>
              ) : (
                cotizaciones.map((cotizacion) => (
                  <TableRow key={cotizacion.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(cotizacion.id)}
                        onCheckedChange={() => toggleRowSelection(cotizacion.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <span 
                        className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => handleOpenDetail(cotizacion)}
                      >
                        {cotizacion.properties.dealname || "Sin nombre"}
                      </span>
                    </TableCell>

                    {/* Tipo de Proceso - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "tipodeproceso" ? (
                        <Select
                          defaultValue={
                            cotizacion.properties.tipo_de_proceso || undefined
                          }
                          onValueChange={(value) =>
                            updateField(cotizacion.id, "tipodeproceso", value)
                          }
                          onOpenChange={(open) =>
                            !open && setEditingCell(null)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TIPO_PROCESO_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "tipodeproceso",
                            })
                          }
                        >
                          {cotizacion.properties.tipo_de_proceso
                            ? TIPO_PROCESO_LABELS[
                                cotizacion.properties.tipo_de_proceso as TipoDeProceso
                              ]
                            : "-"}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Estado del Suplidor - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "estadodelsuplidor" ? (
                        <Select
                          defaultValue={
                            cotizacion.properties.estado_del_suplidor || undefined
                          }
                          onValueChange={(value) =>
                            updateField(cotizacion.id, "estadodelsuplidor", value)
                          }
                          onOpenChange={(open) =>
                            !open && setEditingCell(null)
                          }
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ESTADO_SUPLIDOR_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={`${getStatusColor(
                            cotizacion.properties.estado_del_suplidor || "",
                            "suplidor"
                          )} text-white cursor-pointer`}
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "estadodelsuplidor",
                            })
                          }
                        >
                          {cotizacion.properties.estado_del_suplidor
                            ? ESTADO_SUPLIDOR_LABELS[
                                cotizacion.properties.estado_del_suplidor as EstadoDelSuplidor
                              ]
                            : "-"}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Fecha Solicitud - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "fechasolicituda_suplidor" ? (
                        <Input
                          type="date"
                          defaultValue={
                            cotizacion.properties.fecha_solicitud_a_suplidor || ""
                          }
                          onBlur={(e) =>
                            updateField(
                              cotizacion.id,
                              "fechasolicituda_suplidor",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "fechasolicituda_suplidor",
                            })
                          }
                        >
                          {cotizacion.properties.fecha_solicitud_a_suplidor || "-"}
                        </span>
                      )}
                    </TableCell>

                    {/* Fecha Respuesta - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "fecharespuestadel_suplidor" ? (
                        <Input
                          type="date"
                          defaultValue={
                            cotizacion.properties.fecha_respuesta_del_suplidor || ""
                          }
                          onBlur={(e) =>
                            updateField(
                              cotizacion.id,
                              "fecharespuestadel_suplidor",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "fecharespuestadel_suplidor",
                            })
                          }
                        >
                          {cotizacion.properties.fecha_respuesta_del_suplidor || "-"}
                        </span>
                      )}
                    </TableCell>

                    {/* Estado Cotización Operativo - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "estadodela_cotizacion" ? (
                        <Select
                          defaultValue={
                            cotizacion.properties.estado_de_la_cotizacion ||
                            undefined
                          }
                          onValueChange={(value) =>
                            updateField(
                              cotizacion.id,
                              "estadodela_cotizacion",
                              value
                            )
                          }
                          onOpenChange={(open) =>
                            !open && setEditingCell(null)
                          }
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ESTADO_OPERATIVO_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={`${getStatusColor(
                            cotizacion.properties.estado_de_la_cotizacion || "",
                            "operativo"
                          )} text-white cursor-pointer`}
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "estadodela_cotizacion",
                            })
                          }
                        >
                          {cotizacion.properties.estado_de_la_cotizacion
                            ? ESTADO_OPERATIVO_LABELS[
                                cotizacion.properties
                                  .estado_de_la_cotizacion as EstadoOperativoCotizacion
                              ]
                            : "-"}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Trial Solicitado - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "trial_solicitado" ? (
                        <Select
                          defaultValue={
                            cotizacion.properties.trial_solicitado || "false"
                          }
                          onValueChange={(value) =>
                            updateField(
                              cotizacion.id,
                              "trial_solicitado",
                              value === "true"
                            )
                          }
                          onOpenChange={(open) =>
                            !open && setEditingCell(null)
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Sí</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={
                            cotizacion.properties.trial_solicitado === "true"
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer"
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "trial_solicitado",
                            })
                          }
                        >
                          {cotizacion.properties.trial_solicitado === "true"
                            ? "Sí"
                            : "No"}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Resultado - Editable */}
                    <TableCell>
                      {editingCell?.id === cotizacion.id &&
                      editingCell.field === "resultadodela_cotizacion" ? (
                        <Select
                          defaultValue={
                            cotizacion.properties.resultado_de_la_cotizacion ||
                            undefined
                          }
                          onValueChange={(value) =>
                            updateField(
                              cotizacion.id,
                              "resultadodela_cotizacion",
                              value
                            )
                          }
                          onOpenChange={(open) =>
                            !open && setEditingCell(null)
                          }
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(RESULTADO_COTIZACION_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={`${getStatusColor(
                            cotizacion.properties.resultado_de_la_cotizacion || "",
                            "resultado"
                          )} text-white cursor-pointer`}
                          onClick={() =>
                            setEditingCell({
                              id: cotizacion.id,
                              field: "resultadodela_cotizacion",
                            })
                          }
                        >
                          {cotizacion.properties.resultado_de_la_cotizacion
                            ? RESULTADO_COTIZACION_LABELS[
                                cotizacion.properties
                                  .resultado_de_la_cotizacion as ResultadoDeCotizacion
                              ]
                            : "-"}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Updated Date */}
                    <TableCell className="text-sm text-gray-500">
                      {cotizacion.properties.updatedate
                        ? new Date(
                            cotizacion.properties.updatedate
                          ).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : new Date(cotizacion.updatedAt).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {cotizaciones.length > 0 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="cursor-default">
                    Página {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (cotizaciones.length >= 100)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      cotizaciones.length < 100
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Bulk Actions Floating Bar */}
        {selectedRows.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
            <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-4 pr-6">
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold px-4 py-2 rounded-full text-sm">
                {selectedRows.size} seleccionada(s)
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="rounded-full shadow-sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-red-600/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      ¿Confirmas la eliminación masiva?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-gray-700 dark:text-gray-300">
                      Estás a punto de eliminar <strong>{selectedRows.size}</strong> registro(s). 
                      Estos registros serán archivados en HubSpot y también desaparecerán de este panel.
                      ¿Deseas continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel className="rounded-full border-gray-300">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleBatchDelete();
                      }}
                      className="rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all font-semibold"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Sí, eliminar registros"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setSelectedRows(new Set())}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detalle de Cotización Modal */}
      <Dialog open={!!selectedDetail} onOpenChange={(open) => !open && setSelectedDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Detalle de Cotización: {selectedDetail?.properties.dealname}
            </DialogTitle>
            <DialogDescription>
              Revisa la información completa y gestiona comunicaciones o notas de seguimiento.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Información General</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Producto:</span>
                  <span className="font-medium capitalize">
                    {PRODUCTO_LABELS[selectedDetail.properties.producto_cotizado] || 
                     selectedDetail.properties.producto_cotizado?.replace(/_/g, ' ') || "-"}
                  </span>
                  
                  <span className="text-gray-500">Cantidad (Amount):</span>
                  <span className="font-medium">{selectedDetail.properties.amount || "-"}</span>
                  
                  <span className="text-gray-500">Incoterm:</span>
                  <span className="font-medium uppercase">{selectedDetail.properties.incoterm || "-"}</span>
                  
                  <span className="text-gray-500">Puerto Salida:</span>
                  <span className="font-medium">{selectedDetail.properties.puerto_salida || "-"}</span>
                  
                  <span className="text-gray-500">Mercado Origen:</span>
                  <span className="font-medium">{selectedDetail.properties.mercado_origen || "-"}</span>
                  
                  <span className="text-gray-500">Tipo de Cliente:</span>
                  <span className="font-medium capitalize">{selectedDetail.properties.tipo_cliente_operacion?.replace(/_/g, ' ') || "-"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Estado y Fechas</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Pipeline Stage:</span>
                  <span className="font-medium">
                    {DEALSTAGE_LABELS[selectedDetail.properties.dealstage?.toLowerCase()] || 
                     selectedDetail.properties.dealstage || "-"}
                  </span>

                  <span className="text-gray-500">Tipo de Proceso:</span>
                  <span className="font-medium capitalize">{selectedDetail.properties.tipo_de_proceso?.replace(/_/g, ' ') || "-"}</span>

                  <span className="text-gray-500">Fecha Creación:</span>
                  <span className="font-medium">
                    {selectedDetail.properties.createdate 
                      ? new Date(selectedDetail.properties.createdate).toLocaleString("es-ES") 
                      : "-"}
                  </span>
                  
                  <span className="text-gray-500">Última Actualización:</span>
                  <span className="font-medium">
                    {selectedDetail.properties.updatedate 
                      ? new Date(selectedDetail.properties.updatedate).toLocaleString("es-ES") 
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Descripción Adicional</h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {selectedDetail.properties.description || "No hay descripción adicional."}
                </div>
              </div>

              {/* Nueva sección: Información del Contacto */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                  Información del Contacto
                </h3>
                {selectedDetail.contact ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-500">Nombre Completo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedDetail.contact.firstname || ""} {selectedDetail.contact.lastname || ""}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-500">Correo Electrónico:</span>
                      <a 
                        href={`mailto:${selectedDetail.contact.email}`}
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectedDetail.contact.email || "-"}
                      </a>
                    </div>
                    {selectedDetail.contact.phone && (
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-500">Teléfono:</span>
                        <span className="font-semibold">{selectedDetail.contact.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
                    No se encontró un contacto asociado a esta cotización.
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 pt-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={handleOpenNotesModal}>
                  Ver Notas
                </Button>
                <Button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Send className="h-4 w-4" />
                  Enviar Actualización
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Notas */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Notas de la Cotización {selectedDetail?.id ? `(Ref. ${selectedDetail.id})` : ""}
            </DialogTitle>
            <DialogDescription>
              Visualiza el historial de notas asociado y agrega una nueva nota interna.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nueva nota</label>
              <Textarea
                placeholder="Escribe una nota para el equipo..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[110px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddNote} disabled={addingNote || !newNote.trim()}>
                  {addingNote ? "Guardando..." : "Agregar Nota"}
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Historial</h4>
              {notesLoading ? (
                <p className="text-sm text-gray-500">Cargando notas...</p>
              ) : notes.length === 0 ? (
                <p className="text-sm text-gray-500">No hay notas registradas para esta cotización.</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note, idx) => (
                    <div key={`${note.createdAt}-${idx}`} className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900">
                      <p className="text-xs text-gray-500 mb-1">
                        {note.createdAt ? new Date(note.createdAt).toLocaleString("es-ES") : "Sin fecha"}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{note.body || "-"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Comunicación con IA */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Comunicación con el Cliente
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              Informa al cliente sobre el estatus actual de su cotización. Usa la IA para perfeccionar tu mensaje.
            </DialogDescription>
          </DialogHeader>

          {selectedDetail && (
            <div className="space-y-6 py-4">
              {/* Contexto rápido del estatus */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-gray-500 dark:text-gray-500 line-height-1">Estatus Actual</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    {DEALSTAGE_LABELS[selectedDetail.properties.dealstage?.toLowerCase()] || selectedDetail.properties.dealstage}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold text-gray-500 dark:text-gray-500">Producto</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    {PRODUCTO_LABELS[selectedDetail.properties.producto_cotizado] || selectedDetail.properties.producto_cotizado}
                  </span>
                </div>
              </div>

              {/* Área de mensaje */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mensaje Personalizado</label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleProcessAI('improve')}
                      disabled={isProcessingAI || !updateComment}
                      className="h-8 text-xs gap-1.5 border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      {isProcessingAI ? <RefreshCcw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-blue-500" />}
                      Mejorar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleProcessAI('translate_en')}
                      disabled={isProcessingAI || !updateComment}
                      className="h-8 text-xs gap-1.5 border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <Languages className="h-3 w-3 text-slate-500" />
                      EN
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleProcessAI('translate_zh')}
                      disabled={isProcessingAI || !updateComment}
                      className="h-8 text-xs gap-1.5 border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <Languages className="h-3 w-3 text-slate-500" />
                      ZH
                    </Button>
                  </div>
                </div>
                <Textarea 
                  placeholder="Escribe aquí las novedades de la cotización... (ej: Ya estamos validando la logística con el suplidor en Brasil)"
                  className="min-h-[150px] resize-none focus-visible:ring-blue-500 shadow-inner bg-slate-50/30 dark:bg-slate-950/30"
                  value={updateComment}
                  onChange={(e) => setUpdateComment(e.target.value)}
                />
                <p className="text-[10px] text-slate-400">
                  Tip: Escribe una idea básica y usa el botón "Mejorar" para darle un tono profesional.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 border border-slate-200 dark:border-slate-800"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 font-bold shadow-lg shadow-blue-500/20"
                  onClick={handleSendUpdate}
                  disabled={isSendingUpdate || !updateComment}
                >
                  {isSendingUpdate ? (
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSendingUpdate ? "Enviando..." : "Enviar Correo"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
