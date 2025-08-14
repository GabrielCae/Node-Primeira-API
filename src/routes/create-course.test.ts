import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { faker } from "@faker-js/faker"

test("create a course", async () => {
    await server.ready()

    const response = await request(server.server)
        .post("/courses")
        .set("Content-Type", "application/json")
        .send({ title: faker.lorem.words(4) })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
        courseID: expect.any(String),
    })
})