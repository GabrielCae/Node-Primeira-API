import fastify from 'fastify'
import crypto from 'node:crypto'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true, 
                translateTime: 'SYS:HH:MM:ss', 
                ignore: 'pid,hostname', 
            }
        }
    }
})

const coursers = [
    { id: '1', title: "Curso de Node.js" },
    { id: '2', title: "Curso de React" },
    { id: '3', title: "Curso de React Native" }
]

server.get('/courses', () => {
    return { coursers }
})

server.get("/courses/:id", (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id

    const course = coursers.find(course => course.id === courseID)

    if (course)
        return { course }
    else
        return reply.status(404)
})

server.post('/courses', (request, reply) => {
    type Body = {
        title: string
    }

    const courseID = crypto.randomUUID()
    const body = request.body as Body
    const courseTitle = body.title

    if (!courseTitle)
        return reply.status(400).send({ message: "Título obrigatório" })

    coursers.push({ id: courseID, title: courseTitle })

    // Sempre retornar um objeto
    return reply.status(201).send({ courseID })
})

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP Server runing")
})