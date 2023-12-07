const getResponse = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (response.ok) {
            return  await response.json();
        }
    } catch (error) {
        console.log(error);
    }
};