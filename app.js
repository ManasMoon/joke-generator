const API_KEY = "YOUR_API_KEY"; // Replace this!

document.getElementById('generate-btn').addEventListener('click', async () => {
    const topic = document.getElementById('topic-input').value.trim();
    const resultDiv = document.getElementById('result');
    const loader = document.querySelector('.loader');

    if (!topic) {
        alert('Please enter a topic!');
        return;
    }

    try {
        loader.classList.remove('hidden');
        resultDiv.textContent = '';

        // Step 1: Use strict instruction format
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `[INST]
                    Create a funny 3-sentence story about ${topic} that ends with a punny punchline.
                    Example for "banana":
                    A banana wanted to join the circus but kept slipping. It finally found its calling as a smoothie star. "I guess I was born to be pulp fiction!"
                    [/INST]
                    `,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.85,
                        repetition_penalty: 1.8,
                        top_k: 50
                    }
                })
            }
        );

        // Step 2: Advanced cleaning
        const data = await response.json();
        if (data[0]?.generated_text) {
            const cleanJoke = data[0].generated_text
                .replace(/\[INST\].*\[\/INST\]/gs, '') // Remove instruction block
                .replace(/Example for.*/gs, '') // Remove example text
                .replace(/"/g, '') // Remove quotes
                .trim();

            resultDiv.innerHTML = `<div class="story-joke">${cleanJoke || "🤖 Robot comedian malfunction! Try again..."}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = '<div class="error">🎤 Comedy circuit overload! Refresh and try again.</div>';
    } finally {
        loader.classList.add('hidden');
    }
});