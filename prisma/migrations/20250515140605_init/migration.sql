-- CreateTable
CREATE TABLE "usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "foto_perfil_url" VARCHAR(512),
    "biografia" TEXT,
    "data_registro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_atividade" TIMESTAMPTZ,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "nivel_permissao" INTEGER NOT NULL DEFAULT 0,
    "cidade" VARCHAR(100),
    "estado" VARCHAR(50),
    "pais" VARCHAR(50),
    "data_nascimento" DATE,
    "genero" VARCHAR(30),
    "preferencias" JSONB,
    "nome_empresa" TEXT,
    -- "cpf" varchar(11) NOT NULL,
    -- "cnpj" varchar(14) NOT NULL,
    "cnpj" TEXT,
    "site" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "evento_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "localizacao" VARCHAR(255),
    "coordenadas" JSONB,
    "data_inicio" TIMESTAMPTZ NOT NULL,
    "data_fim" TIMESTAMPTZ,
    "prazo_inscricao" TIMESTAMPTZ,
    "organizador_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Agendado',
    "capacidade_maxima" INTEGER,
    "taxa_inscricao" DECIMAL(10,2),
    "capa_url" VARCHAR(512),
    "modalidade" VARCHAR(50),
    "site_oficial" VARCHAR(255),
    "data_criacao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- "curtida" DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    "metadados" JSONB,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("evento_id")
);

-- CreateTable
CREATE TABLE "usuario_eventos" (
    "usuario_evento_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "data_inscricao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Inscrito',
    "numero_atleta" VARCHAR(50),
    "codigo_confirmacao" VARCHAR(100),
    "origem_inscricao" VARCHAR(50) NOT NULL DEFAULT 'app',
    "comprovante_pagamento_url" VARCHAR(512),
    "observacoes" TEXT,

    CONSTRAINT "usuario_eventos_pkey" PRIMARY KEY ("usuario_evento_id")
);

-- CreateTable
CREATE TABLE "fotos_eventos" (
    "foto_id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "foto_url" VARCHAR(512) NOT NULL,
    "thumbnail_url" VARCHAR(512),
    "legenda" TEXT,
    "data_upload" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coordenadas" JSONB,
    "visibilidade" VARCHAR(20) NOT NULL DEFAULT 'publica',
    "metadados" JSONB,

    CONSTRAINT "fotos_eventos_pkey" PRIMARY KEY ("foto_id")
);

-- CreateTable
CREATE TABLE "comentarios_eventos" (
    "comentario_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "comentario_texto" TEXT NOT NULL,
    "data_comentario" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario_pai_id" INTEGER,
    "reacoes" JSONB NOT NULL DEFAULT '{"curtidas": 0, "coracao": 0}',
    "reportado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "comentarios_eventos_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateTable
CREATE TABLE "resultados_corrida_usuario" (
    "resultado_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "posicao_geral" INTEGER,
    "posicao_categoria" INTEGER,
    "tempo_liquido" TEXT NOT NULL,
    "tempo_bruto" TEXT,
    "categoria_corrida" VARCHAR(100),
    "ritmo_medio" TEXT,
    "velocidade_media" DECIMAL(5,2),
    "distancia_percorrida" DECIMAL(10,2),
    "link_certificado" VARCHAR(512),
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "fonte_dados" VARCHAR(50) NOT NULL DEFAULT 'manual',
    "chip_id" VARCHAR(100),
    "splits" JSONB,

    CONSTRAINT "resultados_corrida_usuario_pkey" PRIMARY KEY ("resultado_id")
);

-- CreateTable
CREATE TABLE "medalhas_usuario" (
    "medalha_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome_medalha" VARCHAR(100) NOT NULL,
    "descricao_medalha" TEXT,
    "data_conquista" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evento_id" INTEGER,
    "tipo_medalha" VARCHAR(50) NOT NULL,
    "nivel_medalha" INTEGER NOT NULL DEFAULT 1,
    "medalha_url" VARCHAR(512),
    "pontos_xp" INTEGER NOT NULL DEFAULT 0,
    "exibir_perfil" BOOLEAN NOT NULL DEFAULT true,
    "requisitos_json" JSONB,

    CONSTRAINT "medalhas_usuario_pkey" PRIMARY KEY ("medalha_id")
);

-- CreateTable
CREATE TABLE "comentarios_perfil" (
    "comentario_id" SERIAL NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "comentario_texto" TEXT NOT NULL,
    "data_comentario" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario_pai_id" INTEGER,
    "reacoes" JSONB NOT NULL DEFAULT '{"curtidas": 0, "coracao": 0}',
    "visibilidade" VARCHAR(20) NOT NULL DEFAULT 'publica',

    CONSTRAINT "comentarios_perfil_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateTable
CREATE TABLE "seguidores" (
    "usuario_id" INTEGER NOT NULL,
    "seguidor_id" INTEGER NOT NULL,
    "data_seguindo" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificacoes_ativas" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "seguidores_pkey" PRIMARY KEY ("usuario_id","seguidor_id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "notificacao_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data_criacao" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "acao_url" VARCHAR(255),
    "entidade_id" INTEGER,
    "entidade_tipo" VARCHAR(50),
    "metadados" JSONB,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("notificacao_id")
);

-- CreateTable
CREATE TABLE "estatisticas_usuario" (
    "estatistica_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "total_corridas" INTEGER NOT NULL DEFAULT 0,
    "total_distancia" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "melhor_tempo_5k" TEXT,
    "melhor_tempo_10k" TEXT,
    "melhor_tempo_21k" TEXT,
    "melhor_tempo_42k" TEXT,
    "nivel_corredor" INTEGER NOT NULL DEFAULT 1,
    "pontos_xp" INTEGER NOT NULL DEFAULT 0,
    "ultimo_calculo" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streaks" JSONB,
    "recordes" JSONB,

    CONSTRAINT "estatisticas_usuario_pkey" PRIMARY KEY ("estatistica_id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "categoria_id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "distancia" DECIMAL(10,2),
    "icone_url" VARCHAR(512),

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("categoria_id")
);

-- CreateTable
CREATE TABLE "evento_categorias" (
    "evento_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "evento_categorias_pkey" PRIMARY KEY ("evento_id","categoria_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_eventos_usuario_id_evento_id_key" ON "usuario_eventos"("usuario_id", "evento_id");

-- CreateIndex
CREATE UNIQUE INDEX "resultados_corrida_usuario_usuario_id_evento_id_key" ON "resultados_corrida_usuario"("usuario_id", "evento_id");

-- CreateIndex
CREATE UNIQUE INDEX "estatisticas_usuario_usuario_id_key" ON "estatisticas_usuario"("usuario_id");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_organizador_id_fkey" FOREIGN KEY ("organizador_id") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_eventos" ADD CONSTRAINT "usuario_eventos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_eventos" ADD CONSTRAINT "usuario_eventos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("evento_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_eventos" ADD CONSTRAINT "fotos_eventos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("evento_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_eventos" ADD CONSTRAINT "fotos_eventos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_eventos" ADD CONSTRAINT "comentarios_eventos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_eventos" ADD CONSTRAINT "comentarios_eventos_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("evento_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_eventos" ADD CONSTRAINT "comentarios_eventos_comentario_pai_id_fkey" FOREIGN KEY ("comentario_pai_id") REFERENCES "comentarios_eventos"("comentario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultados_corrida_usuario" ADD CONSTRAINT "resultados_corrida_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultados_corrida_usuario" ADD CONSTRAINT "resultados_corrida_usuario_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("evento_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medalhas_usuario" ADD CONSTRAINT "medalhas_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medalhas_usuario" ADD CONSTRAINT "medalhas_usuario_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("evento_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_perfil" ADD CONSTRAINT "comentarios_perfil_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_perfil" ADD CONSTRAINT "comentarios_perfil_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_perfil" ADD CONSTRAINT "comentarios_perfil_comentario_pai_id_fkey" FOREIGN KEY ("comentario_pai_id") REFERENCES "comentarios_perfil"("comentario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_seguidor_id_fkey" FOREIGN KEY ("seguidor_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatisticas_usuario" ADD CONSTRAINT "estatisticas_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_categorias" ADD CONSTRAINT "evento_categorias_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("evento_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_categorias" ADD CONSTRAINT "evento_categorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("categoria_id") ON DELETE CASCADE ON UPDATE CASCADE;
