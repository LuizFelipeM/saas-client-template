import { cookies } from "next/headers"

export default async function getExamples() {
    const cookie = (await cookies())
    const jwt = cookie.get('__session')?.value
    const res = await fetch('http://localhost/examples?name=Luiz', {
        headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
            Cookie: cookie.toString()
        }
    })
    return await res.json()
}