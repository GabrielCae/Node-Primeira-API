import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeCourse } from "../tests/factories/make-course.ts"

test("get a course by id", async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test("fail in get a course by id", async () => {
    await server.ready()

    const response = await request(server.server)
        .get(`/courses/0d9ef16b-7d41-4831-be12-6f2e0b5da437`)

    expect(response.status).toEqual(404)
})