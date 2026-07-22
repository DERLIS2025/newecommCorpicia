'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AuditStatus = 'correct' | 'review' | 'critical';

type AuditIssue = {
  label: string;
  critical?: boolean;
};

type AuditProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  price_amount?: number | null;
  unit?: string | null;
  is_active?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  categories?:
    | {
        name?: string | null;
        slug?: string | null;
      }
    | Array<{
        name?: string | null;
        slug?: string | null;
      }>
    | null;
  product_images?: Array<{
    image_url?: string | null;
  }> | null;
  product_features?: Array<{
    feature_text?: string | null;
  }> | null;
  product_specifications?: Array<{
    spec_key?: string | null;
    spec_value?: string | null;
  }> | null;
  product_recommendations?: Array<{
    recommendation_text?: string | null;
  }> | null;
};

function getCategory(product: AuditProduct) {
  if (Array.isArray(product.categories)) {
    return product.categories[0] || null;
  }

  return product.categories || null;
}

function auditProduct(product: AuditProduct) {
  const issues: AuditIssue[] = [];
  const category = getCategory(product);

  const images = product.product_images || [];
  const features = product.product_features || [];
  const specifications = product.product_specifications || [];
  const recommendations = product.product_recommendations || [];
  const seoKeywords = product.seo_keywords || [];

  if (!product.name?.trim()) {
    issues.push({ label: 'Sin nombre', critical: true });
  }

  if (!product.slug?.trim()) {
    issues.push({ label: 'Sin slug', critical: true });
  }

  if (!category?.name) {
    issues.push({ label: 'Sin categoría', critical: true });
  }

  if (!Number.isFinite(Number(product.price_amount)) || Number(product.price_amount) <= 0) {
    issues.push({ label: 'Precio vacío o en cero', critical: true });
  }

  if (
    images.length === 0 ||
    !images.some((image) => image.image_url?.trim())
  ) {
    issues.push({ label: 'Sin imagen', critical: true });
  }

  if (!product.short_description?.trim()) {
    issues.push({ label: 'Sin descripción corta' });
  } else if (product.short_description.trim().length < 80) {
    issues.push({ label: 'Descripción corta demasiado breve' });
  }

  if (!product.description?.trim()) {
    issues.push({ label: 'Sin descripción completa' });
  } else if (product.description.trim().length < 150) {
    issues.push({ label: 'Descripción completa demasiado breve' });
  }

  if (features.length === 0) {
    issues.push({ label: 'Sin características' });
  }

  if (specifications.length === 0) {
    issues.push({ label: 'Sin especificaciones' });
  }

  if (recommendations.length === 0) {
    issues.push({ label: 'Sin recomendaciones' });
  }

  if (!product.seo_title?.trim()) {
    issues.push({ label: 'Sin título SEO' });
  } else if (product.seo_title.trim().length > 60) {
    issues.push({ label: 'Título SEO supera 60 caracteres' });
  }

  if (!product.seo_description?.trim()) {
    issues.push({ label: 'Sin meta descripción' });
  } else {
    const seoLength = product.seo_description.trim().length;

    if (seoLength < 120) {
      issues.push({ label: 'Meta descripción demasiado corta' });
    }

    if (seoLength > 160) {
      issues.push({ label: 'Meta descripción supera 160 caracteres' });
    }
  }

  if (seoKeywords.length === 0) {
    issues.push({ label: 'Sin palabras clave SEO' });
  }

  const hasCriticalIssue = issues.some((issue) => issue.critical);

  let status: AuditStatus = 'correct';

  if (hasCriticalIssue) {
    status = 'critical';
  } else if (issues.length > 0) {
    status = 'review';
  }

  return {
    ...product,
    category,
    issues,
    status,
  };
}

function statusLabel(status: AuditStatus) {
  if (status === 'critical') return 'Crítico';
  if (status === 'review') return 'Necesita revisión';
  return 'Correcto';
}

function statusClasses(status: AuditStatus) {
  if (status === 'critical') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (status === 'review') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  return 'border-green-200 bg-green-50 text-green-700';
}

export default function ProductAuditDashboard({
  products,
}: {
  products: AuditProduct[];
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AuditStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const auditedProducts = useMemo(
    () => products.map(auditProduct),
    [products]
  );

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        auditedProducts
          .map((product) => product.category?.name)
          .filter(Boolean)
      )
    ).sort() as string[];
  }, [auditedProducts]);

  const summary = useMemo(() => {
    return {
      total: auditedProducts.length,
      correct: auditedProducts.filter(
        (product) => product.status === 'correct'
      ).length,
      review: auditedProducts.filter(
        (product) => product.status === 'review'
      ).length,
      critical: auditedProducts.filter(
        (product) => product.status === 'critical'
      ).length,
    };
  }, [auditedProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return auditedProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.slug?.toLowerCase().includes(normalizedSearch) ||
        product.category?.name?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' ||
        product.category?.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [auditedProducts, search, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Auditoría del catálogo
          </h1>
          <p className="mt-1 text-gray-500">
            Detectá productos incompletos antes de publicarlos.
          </p>
        </div>

        <Link href="/admin/productos">
          <Button variant="outline">Volver a productos</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total de productos</p>
          <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">Correctos</p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-green-800">
            {summary.correct}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">Necesitan revisión</p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-amber-800">
            {summary.review}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-red-700">
            <ShieldAlert className="h-5 w-5" />
            <p className="text-sm font-medium">Críticos</p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-red-800">
            {summary.critical}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto, slug o categoría..."
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as 'all' | AuditStatus
              )
            }
            className="h-10 rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="critical">Críticos</option>
            <option value="review">Necesitan revisión</option>
            <option value="correct">Correctos</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(
                      product.status
                    )}`}
                  >
                    {statusLabel(product.status)}
                  </span>

                  {!product.is_active && (
                    <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      Inactivo
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {product.category?.name || 'Sin categoría'} · /
                  productos/{product.slug}
                </p>

                {product.issues.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.issues.map((issue, index) => (
                      <span
                        key={`${issue.label}-${index}`}
                        className={`rounded-md border px-2.5 py-1 text-xs ${
                          issue.critical
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {issue.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-green-700">
                    El producto tiene la información principal completa.
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href={`/admin/productos/${product.id}/editar`}>
                  <Button variant="outline">Editar</Button>
                </Link>

                <Link href={`/admin/productos/${product.id}/editar`}>
                  <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Corregir con IA
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        ))}

        {filteredProducts.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center">
            <p className="font-medium text-gray-700">
              No se encontraron productos.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Cambiá los filtros o el término de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
