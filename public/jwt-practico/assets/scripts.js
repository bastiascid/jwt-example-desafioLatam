const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({email:email,password:password})
            })
        const { token } = await response.json()
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

$(`#js-form`).submit(async (event) => {
    event.preventDefault()
    const email = document.getElementById(`js-input-email`).value
    const password = document.getElementById(`js-input-password`).value
    const JWT = await postData(email, password)
    const posts = await getPosts(JWT)
    fillTable(posts,'js-table-posts')
    console.log(posts)
    console.log(JWT)
    console.log(email)
    console.log(password)
})

const getPosts = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/posts`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        return data
    }
    catch (err) {
        console.error(`Error:${err}​`)
    }
}

const fillTable = (data, table) => {
    let rows = "";
    $.each(data, (i, row) => {
        rows += `<tr>
                    <td>${row.title}</td>
                    <td>${row.body}</td>
                </tr>`
    })
    $(`#${table} tbody`).append(rows);
}

