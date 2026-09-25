import { ToolCard } from '@/components/tool-card'
import { categorias, ordemCategorias } from '@/tools/_core/categorias'
import { manifests } from '@/tools/registry'

const Home = () => {
  const todas = manifests()

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Ferramentas rápidas
        </h1>
        <p className="text-muted-foreground">
          Sem login, sem anúncios, sem espera. Aperte{' '}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
            Ctrl
          </kbd>{' '}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
            K
          </kbd>{' '}
          para buscar.
        </p>
      </section>

      {ordemCategorias.map((categoria) => {
        const daCategoria = todas.filter(
          (manifest) => manifest.categoria === categoria,
        )

        if (daCategoria.length === 0) {
          return null
        }

        return (
          <section key={categoria} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold tracking-tight">
                {categorias[categoria].nome}
              </h2>
              <p className="text-sm text-muted-foreground">
                {categorias[categoria].descricao}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {daCategoria.map((manifest) => {
                const Icone = manifest.icone

                return (
                  <ToolCard
                    key={manifest.slug}
                    slug={manifest.slug}
                    nome={manifest.nome}
                    descricao={manifest.descricao}
                    icone={<Icone className="size-4" />}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default Home
