const fetchData = async (apiRoute, method, requestBody) => {
    try {

        const getMethodString = "GET"

        const getRegex = new RegExp(getMethodString, "i")

        let response

        if (getRegex.test(method)) {
            response = await fetch("/api" + apiRoute, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
            })
        } else {
            response = await fetch("/api" + apiRoute, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
        }

        return response
    } catch (error) {
        console.log(`Error fetching data: ${error}`)
        return null
    }
}

export default fetchData