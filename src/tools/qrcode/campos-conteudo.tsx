'use client'

import { Campo } from '@/components/campo'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import type { TipoChavePix } from '@/shared/brasil/pix'
import {
  LIMITE_CIDADE,
  LIMITE_IDENTIFICADOR,
  LIMITE_NOME,
  tiposDeChave,
} from '@/shared/brasil/pix'

import type {
  DadosConteudo,
  SegurancaWifi,
  TipoConteudo,
} from './tipos-conteudo'

type Atualizar = <T extends TipoConteudo>(
  tipo: T,
  parcial: Partial<DadosConteudo[T]>,
) => void

type CamposConteudoProps = {
  tipo: TipoConteudo
  dados: DadosConteudo
  atualizar: Atualizar
}

const LIMITE_TEXTO = 1_000
const grade = 'grid gap-4 sm:grid-cols-2'

const Nota = ({ children }: { children: string }) => (
  <p className="text-xs text-muted-foreground">{children}</p>
)

const CamposConteudo = ({ tipo, dados, atualizar }: CamposConteudoProps) => {
  switch (tipo) {
    case 'link':
      return (
        <Campo rotulo="Endereço do site">
          <Input
            value={dados.link.url}
            onChange={(evento) =>
              atualizar('link', { url: evento.target.value })
            }
            placeholder="https://"
            inputMode="url"
            autoComplete="url"
          />
        </Campo>
      )

    case 'texto':
      return (
        <Campo rotulo="Texto" dica={`até ${LIMITE_TEXTO} caracteres`}>
          <Textarea
            value={dados.texto.texto}
            onChange={(evento) =>
              atualizar('texto', { texto: evento.target.value })
            }
            maxLength={LIMITE_TEXTO}
            rows={4}
          />
        </Campo>
      )

    case 'email':
      return (
        <div className={grade}>
          <Campo rotulo="Para">
            <Input
              type="email"
              value={dados.email.para}
              onChange={(evento) =>
                atualizar('email', { para: evento.target.value })
              }
              placeholder="contato@exemplo.com.br"
            />
          </Campo>
          <Campo rotulo="Assunto" dica="opcional">
            <Input
              value={dados.email.assunto}
              onChange={(evento) =>
                atualizar('email', { assunto: evento.target.value })
              }
            />
          </Campo>
          <Campo rotulo="Mensagem" dica="opcional" className="sm:col-span-2">
            <Textarea
              value={dados.email.mensagem}
              onChange={(evento) =>
                atualizar('email', { mensagem: evento.target.value })
              }
              rows={3}
            />
          </Campo>
        </div>
      )

    case 'ligacao':
      return (
        <Campo rotulo="Telefone" dica="com DDD">
          <Input
            type="tel"
            value={dados.ligacao.telefone}
            onChange={(evento) =>
              atualizar('ligacao', { telefone: evento.target.value })
            }
            placeholder="(11) 99999-9999"
          />
        </Campo>
      )

    case 'sms':
    case 'whatsapp':
      return (
        <div className={grade}>
          <Campo rotulo="Telefone" dica="com DDD">
            <Input
              type="tel"
              value={dados[tipo].telefone}
              onChange={(evento) =>
                atualizar(tipo, { telefone: evento.target.value })
              }
              placeholder="(11) 99999-9999"
            />
          </Campo>
          <Campo rotulo="Mensagem" dica="opcional" className="sm:col-span-2">
            <Textarea
              value={dados[tipo].mensagem}
              onChange={(evento) =>
                atualizar(tipo, { mensagem: evento.target.value })
              }
              rows={3}
            />
          </Campo>
        </div>
      )

    case 'wifi':
      return (
        <div className={grade}>
          <Campo rotulo="Nome da rede">
            <Input
              value={dados.wifi.rede}
              onChange={(evento) =>
                atualizar('wifi', { rede: evento.target.value })
              }
              autoComplete="off"
            />
          </Campo>
          <Campo rotulo="Segurança">
            <NativeSelect
              value={dados.wifi.seguranca}
              onChange={(evento) =>
                atualizar('wifi', {
                  seguranca: evento.target.value as SegurancaWifi,
                })
              }
              className="w-full"
            >
              <NativeSelectOption value="WPA">
                WPA / WPA2 / WPA3
              </NativeSelectOption>
              <NativeSelectOption value="WEP">WEP</NativeSelectOption>
              <NativeSelectOption value="nopass">Sem senha</NativeSelectOption>
            </NativeSelect>
          </Campo>
          <Campo rotulo="Senha">
            <Input
              value={dados.wifi.senha}
              onChange={(evento) =>
                atualizar('wifi', { senha: evento.target.value })
              }
              disabled={dados.wifi.seguranca === 'nopass'}
              autoComplete="off"
            />
          </Campo>
          <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
            <input
              type="checkbox"
              checked={dados.wifi.oculta}
              onChange={(evento) =>
                atualizar('wifi', { oculta: evento.target.checked })
              }
              className="size-4 accent-primary"
            />
            Rede oculta
          </label>
          <div className="sm:col-span-2">
            <Nota>
              A senha não sai do seu navegador: o QR é gerado aqui mesmo.
            </Nota>
          </div>
        </div>
      )

    case 'vcard':
      return (
        <div className={grade}>
          <Campo rotulo="Nome">
            <Input
              value={dados.vcard.nome}
              onChange={(evento) =>
                atualizar('vcard', { nome: evento.target.value })
              }
              autoComplete="given-name"
            />
          </Campo>
          <Campo rotulo="Sobrenome">
            <Input
              value={dados.vcard.sobrenome}
              onChange={(evento) =>
                atualizar('vcard', { sobrenome: evento.target.value })
              }
              autoComplete="family-name"
            />
          </Campo>
          <Campo rotulo="Telefone" dica="opcional">
            <Input
              type="tel"
              value={dados.vcard.telefone}
              onChange={(evento) =>
                atualizar('vcard', { telefone: evento.target.value })
              }
              placeholder="(11) 99999-9999"
            />
          </Campo>
          <Campo rotulo="E-mail" dica="opcional">
            <Input
              type="email"
              value={dados.vcard.email}
              onChange={(evento) =>
                atualizar('vcard', { email: evento.target.value })
              }
            />
          </Campo>
          <Campo rotulo="Empresa" dica="opcional">
            <Input
              value={dados.vcard.empresa}
              onChange={(evento) =>
                atualizar('vcard', { empresa: evento.target.value })
              }
              autoComplete="organization"
            />
          </Campo>
          <Campo rotulo="Cargo" dica="opcional">
            <Input
              value={dados.vcard.cargo}
              onChange={(evento) =>
                atualizar('vcard', { cargo: evento.target.value })
              }
              autoComplete="organization-title"
            />
          </Campo>
          <Campo rotulo="Site" dica="opcional" className="sm:col-span-2">
            <Input
              value={dados.vcard.site}
              onChange={(evento) =>
                atualizar('vcard', { site: evento.target.value })
              }
              inputMode="url"
              placeholder="https://"
            />
          </Campo>
        </div>
      )

    case 'evento':
      return (
        <div className={grade}>
          <Campo rotulo="Título" className="sm:col-span-2">
            <Input
              value={dados.evento.titulo}
              onChange={(evento) =>
                atualizar('evento', { titulo: evento.target.value })
              }
            />
          </Campo>
          <Campo rotulo="Início">
            <Input
              type="datetime-local"
              value={dados.evento.inicio}
              onChange={(evento) =>
                atualizar('evento', { inicio: evento.target.value })
              }
            />
          </Campo>
          <Campo rotulo="Fim" dica="opcional, padrão 1 hora">
            <Input
              type="datetime-local"
              value={dados.evento.fim}
              onChange={(evento) =>
                atualizar('evento', { fim: evento.target.value })
              }
            />
          </Campo>
          <Campo rotulo="Local" dica="opcional" className="sm:col-span-2">
            <Input
              value={dados.evento.local}
              onChange={(evento) =>
                atualizar('evento', { local: evento.target.value })
              }
            />
          </Campo>
          <Campo rotulo="Descrição" dica="opcional" className="sm:col-span-2">
            <Textarea
              value={dados.evento.descricao}
              onChange={(evento) =>
                atualizar('evento', { descricao: evento.target.value })
              }
              rows={3}
            />
          </Campo>
        </div>
      )

    case 'pix':
      return (
        <div className={grade}>
          <Campo rotulo="Tipo de chave">
            <NativeSelect
              value={dados.pix.tipoChave}
              onChange={(evento) =>
                atualizar('pix', {
                  tipoChave: evento.target.value as TipoChavePix,
                })
              }
              className="w-full"
            >
              {tiposDeChave.map((chave) => (
                <NativeSelectOption key={chave.id} value={chave.id}>
                  {chave.rotulo}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Campo>
          <Campo rotulo="Chave Pix">
            <Input
              value={dados.pix.chave}
              onChange={(evento) =>
                atualizar('pix', { chave: evento.target.value })
              }
              autoComplete="off"
            />
          </Campo>
          <Campo rotulo="Nome de quem recebe" dica={`até ${LIMITE_NOME}`}>
            <Input
              value={dados.pix.nome}
              onChange={(evento) =>
                atualizar('pix', { nome: evento.target.value })
              }
              maxLength={LIMITE_NOME}
            />
          </Campo>
          <Campo rotulo="Cidade" dica={`até ${LIMITE_CIDADE}`}>
            <Input
              value={dados.pix.cidade}
              onChange={(evento) =>
                atualizar('pix', { cidade: evento.target.value })
              }
              maxLength={LIMITE_CIDADE}
            />
          </Campo>
          <Campo rotulo="Valor" dica="opcional">
            <Input
              value={dados.pix.valor}
              onChange={(evento) =>
                atualizar('pix', { valor: evento.target.value })
              }
              inputMode="decimal"
              placeholder="10,50"
            />
          </Campo>
          <Campo rotulo="Identificador" dica="opcional">
            <Input
              value={dados.pix.identificador}
              onChange={(evento) =>
                atualizar('pix', { identificador: evento.target.value })
              }
              maxLength={LIMITE_IDENTIFICADOR}
              placeholder="PEDIDO123"
            />
          </Campo>
          <div className="sm:col-span-2">
            <Nota>
              Confira o QR no app do seu banco antes de divulgar: o banco mostra
              o nome de quem vai receber.
            </Nota>
          </div>
        </div>
      )
  }
}

export { CamposConteudo }
export type { Atualizar }
