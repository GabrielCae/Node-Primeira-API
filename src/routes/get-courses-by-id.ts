import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts"

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get("/courses/:id", {
        preHandler: [
            checkRequestJWT,
        ],
        schema: {
            params: z.object({
                id: z.uuid()
            }),
            tags: ["courses"],
            summary: "Get a course by id",
            description: "Essa rota filtra um curso pelo seu ID",
            response: {
                200: z.object({
                    course: z.object({
                        id: z.uuid(),
                        title: z.string(),
                        description: z.string().nullable()
                    })
                }),
                404: z.object({ message: z.string() })
            }
        }
    }, async (request, reply) => {
        const courseID = request.params.id
        const user = getAuthenticatedUserFromRequest(request)

        const result = await db
            .select()
            .from(courses)
            .where(eq(courses.id, courseID))

        if (result.length > 0)
            return { course: result[0] }

        return reply.status(404).send({ message: "Curso não encontrado!" })
    })
}