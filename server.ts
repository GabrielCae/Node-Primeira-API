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

const courses = [
    { id: '1', title: "Curso de Node.js" },
    { id: '2', title: "Curso de React" },
    { id: '3', title: "Curso de React Native" }
]

const findCourse = (id: string) => {
    return courses.find(course => course.id === id)
}

server.get('/courses', () => {
    return { courses }
})

server.get("/courses/:id", (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id

    const course = findCourse(courseID)

    if (course)
        return { course }
    else
        return reply.status(404).send({ message: "Curso não encontrado!" })
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

    courses.push({ id: courseID, title: courseTitle })

    // Sempre retornar um objeto
    return reply.status(201).send({ message: `Curso criado com sucesso! ID: ${courseID}` })
})

server.delete("/courses/:id", (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseID = params.id

    const course = findCourse(courseID)

    if (course) {
        courses.splice(courses.indexOf(course), 1)
        return reply.status(200).send({ message: "Curso deletado com sucesso!" })
    } else 
        return reply.status(404).send({ message: "Curso não encontrado!" })
})

server.put("/courses/:id", (request, reply) => {
    type Params = {
        id: string
    }
    
    type Body = {
        title: string
    }

    const params = request.params as Params
    const courseID = params.id

    const body = request.body as Body
    const newTitle = body.title

    const course = findCourse(courseID)

    if (course) {
        course.title = newTitle
        return reply.status(200).send({ message: "Nome do curso modificado com sucesso!" })
    } else
        return reply.status(404).send({ message: "Curso não encontrado!" })
})

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP Server running")
})