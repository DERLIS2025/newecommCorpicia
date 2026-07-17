'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Link2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  importProducts,
  readGoogleSheet,
  type BulkProductRow,
  type ImportResult,
} from '@/lib/actions/admin-product-import';

const TEMPLATE_ROWS = [
  {
    name: 'Producto de ejemplo',
    slug: 'producto-de-ejemplo',
    category: 'Césped',
    description: 'Descripción completa del producto.',
    short_description: 'Descripción breve.',
    price_amount: 33000,
    unit: 'm²',
    min_order_quantity: 10,
    is_active: true,
    is_featured: false,
    image_url: 'https://ejemplo.com/imagen.jpg',
  },
];

function normalizeRows(
  rows: Record<string, unknown>[]
): BulkProductRow[] {
  return rows.map((row) => ({
    name: String(row.name ?? row.nombre ?? '').trim(),
    slug: String(row.slug ?? '').trim(),
    category: String(row.category ?? row.categoria ?? '').trim(),
    description: String(row.description ?? row.descripcion ?? '').trim(),
    short_description: String(
      row.short_description ?? row.descripcion_corta ?? ''
    ).trim(),
    price_amount: Number(
      row.price_amount ?? row.precio ?? row.precio_base ?? 0
    ),
    unit: String(row.unit ?? row.unidad ?? '').trim(),
    min_order_quantity: Number(
      row.min_order_quantity ?? row.cantidad_minima ?? 1
    ),
    is_active: ['true', '1', 'sí', 'si', 'activo'].includes(
      String(row.is_active ?? row.activo ?? 'true').toLowerCase()
    ),
    is_featured: ['true', '1', 'sí', 'si'].includes(
      String(row.is_featured ?? row.destacado ?? 'false').toLowerCase()
    ),
    image_url: String(row.image_url ?? row.imagen ?? '').trim(),
  }));
}

export default function ProductBulkImport() {
  const [rows, setRows] = useState<BulkProductRow[]>([]);
  const [sheetUrl, setSheetUrl] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [message, setMessage] = useState('');
  const [importProgress, setImportProgress] = useState('');
  const [isPending, startTransition] = useTransition();

  const invalidRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          !row.name ||
          !row.slug ||
          !row.unit ||
          !Number.isFinite(row.price_amount) ||
          row.price_amount < 0
      ).length,
    [rows]
  );

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_ROWS);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'plantilla-productos-corpicia.xlsx');
  };

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage('');
    setResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const parsed = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: '',
      });

      const normalized = normalizeRows(parsed);
      setRows(normalized);
      setMessage(`${normalized.length} fila(s) cargada(s).`);
    } catch {
      setMessage('No se pudo leer el archivo.');
    }
  };

  const handleGoogleSheet = () => {
    if (!sheetUrl.trim()) {
      setMessage('Pegá primero el enlace de Google Sheets.');
      return;
    }

    startTransition(async () => {
      const response = await readGoogleSheet(sheetUrl);

      if (!response.success || !response.rows) {
        setMessage(response.message ?? 'No se pudo leer la hoja.');
        return;
      }

      setRows(response.rows);
      setResult(null);
      setMessage(`${response.rows.length} fila(s) cargada(s) desde Google Sheets.`);
    });
  };

  const handleImport = () => {
    if (!rows.length) {
      setMessage('Primero cargá un archivo o una hoja.');
      return;
    }

    if (invalidRows > 0) {
      setMessage('Corregí las filas inválidas antes de importar.');
      return;
    }

    startTransition(async () => {
      const chunkSize = 15;
      const totalChunks = Math.ceil(rows.length / chunkSize);

      const accumulated: ImportResult = {
        success: true,
        created: 0,
        updated: 0,
        failed: 0,
        rows: [],
      };

      setResult(null);
      setMessage('');
      setImportProgress(`Preparando ${rows.length} productos...`);

      try {
        for (let index = 0; index < rows.length; index += chunkSize) {
          const chunkNumber = Math.floor(index / chunkSize) + 1;
          const chunk = rows.slice(index, index + chunkSize);

          setImportProgress(
            `Importando lote ${chunkNumber} de ${totalChunks}...`
          );

          const response = await importProducts(chunk);

          accumulated.created += response.created;
          accumulated.updated += response.updated;
          accumulated.failed += response.failed;
          accumulated.success =
            accumulated.success && response.success;
          accumulated.rows.push(...response.rows);
        }

        setResult(accumulated);
        setMessage(
          `Importación terminada: ${accumulated.created} creado(s), ` +
            `${accumulated.updated} actualizado(s), ` +
            `${accumulated.failed} error(es).`
        );
      } catch (error) {
        accumulated.success = false;

        setResult(accumulated);
        setMessage(
          error instanceof Error
            ? `La importación se interrumpió: ${error.message}`
            : 'La importación se interrumpió por un error del servidor.'
        );
      } finally {
        setImportProgress('');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/productos"
            className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">
            Importar productos
          </h1>

          <p className="text-gray-500">
            Cargá productos desde Excel, CSV o Google Sheets.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Descargar plantilla
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-green-700" />
            <div>
              <h2 className="font-semibold">Excel o CSV</h2>
              <p className="text-sm text-gray-500">
                Archivos .xlsx, .xls o .csv.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center hover:bg-gray-50">
            <Upload className="mb-3 h-8 w-8 text-gray-400" />
            <span className="font-medium">Seleccionar archivo</span>
            <span className="mt-1 text-sm text-gray-500">
              Excel o CSV
            </span>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Link2 className="h-5 w-5 text-green-700" />
            <div>
              <h2 className="font-semibold">Google Sheets</h2>
              <p className="text-sm text-gray-500">
                La hoja debe tener acceso público de lectura.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              value={sheetUrl}
              onChange={(event) => setSheetUrl(event.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleGoogleSheet}
              className="w-full"
            >
              Leer Google Sheets
            </Button>
          </div>
        </section>
      </div>

      {message && (
        <div className="rounded-lg border bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      {rows.length > 0 && (
        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Vista previa</h2>
              <p className="text-sm text-gray-500">
                {rows.length} producto(s). {invalidRows} fila(s) inválida(s).
              </p>
            </div>

            <Button
              type="button"
              disabled={isPending || invalidRows > 0}
              onClick={handleImport}
            >
              {isPending
                ? importProgress || 'Importando...'
                : 'Confirmar importación'}
            </Button>
          </div>

          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Fila</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Unidad</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {rows.map((row, index) => {
                  const valid =
                    row.name &&
                    row.slug &&
                    row.unit &&
                    Number.isFinite(row.price_amount) &&
                    row.price_amount >= 0;

                  return (
                    <tr key={`${row.slug}-${index}`}>
                      <td className="px-4 py-3">{index + 2}</td>
                      <td className="px-4 py-3">{row.name || '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {row.slug || '—'}
                      </td>
                      <td className="px-4 py-3">{row.category || '—'}</td>
                      <td className="px-4 py-3">
                        {Number(row.price_amount).toLocaleString('es-PY')}
                      </td>
                      <td className="px-4 py-3">{row.unit || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            valid
                              ? 'rounded bg-green-100 px-2 py-1 text-xs text-green-800'
                              : 'rounded bg-red-100 px-2 py-1 text-xs text-red-800'
                          }
                        >
                          {valid ? 'Válido' : 'Revisar'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {result && (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Resultado de la importación</h2>

          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-green-50 p-3">
              <div className="text-2xl font-bold text-green-700">
                {result.created}
              </div>
              <div className="text-xs text-green-800">Creados</div>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <div className="text-2xl font-bold text-blue-700">
                {result.updated}
              </div>
              <div className="text-xs text-blue-800">Actualizados</div>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <div className="text-2xl font-bold text-red-700">
                {result.failed}
              </div>
              <div className="text-xs text-red-800">Errores</div>
            </div>
          </div>

          <div className="max-h-64 space-y-2 overflow-auto text-sm">
            {result.rows.map((row) => (
              <div
                key={`${row.row}-${row.slug}`}
                className="flex items-center justify-between rounded border px-3 py-2"
              >
                <span>
                  Fila {row.row}: {row.slug || 'sin slug'}
                </span>
                <span
                  className={
                    row.status === 'error'
                      ? 'text-red-700'
                      : row.status === 'created'
                        ? 'text-green-700'
                        : 'text-blue-700'
                  }
                >
                  {row.message}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
