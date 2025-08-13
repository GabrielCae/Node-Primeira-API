import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { z } from "zod"

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        schema: {
            tags: ["courses"],
            summary: "Create a course",
            description: "Essa rota recebe um título e cria um curso no banco de dados",
            body: z.object({
                title: z.string().min(5, "Título precisa ter, no mínimo, 5 caracteres"),
            }),
            response: {
                201: z.object({ courseID: z.uuid() }).describe("Curso criado com sucesso"),
                400: z.object({ message: z.string() }).describe("Curso não foi criado")
            }
        },
    }, async (request, reply) => {
        const courseTitle = request.body.title

        if (!courseTitle)
            return reply.status(400).send({ message: "Título obrigatório" })

        const result = await db
            .insert(courses)
            .values({
                title: courseTitle
            })
            .returning()

        // Sempre retornar um objeto
        return reply.status(201).send({ courseID: result[0].id })
    })
}