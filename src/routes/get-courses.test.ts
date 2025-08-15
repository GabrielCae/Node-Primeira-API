import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeCourse } from "../tests/factories/make-course.ts"
import { randomUUID } from "node:crypto"
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts"

test("get all courses", async () => {
    await server.ready()

    const titleID = randomUUID()

    const course = await makeCourse(titleID)
    const { token } = await makeAuthenticatedUser('manager')

    const response = await request(server.server)
        .get(`/courses?search=${titleID}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: titleID,
                enrollments: 0,
            }
        ]
    })
})