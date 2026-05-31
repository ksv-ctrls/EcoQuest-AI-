# chat.py
import os
from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI

# Create OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are EcoSDG Bot, a helpful mini chatbot focused on environmental education and the UN Sustainable Development Goals (SDGs).
Your knowledge is based on resources like IPCC reports, WWF, UNESCO, and SDG frameworks (e.g., Goals 3, 7, 13).
Provide concise, factual, educational responses. Promote sustainability with tips or facts.
If asked about non-environmental topics, politely redirect to SDGs or eco-themes.
Keep responses under 200 words. Be engaging and positive.
Use simple language suitable for a general audience. 
note: the output should be well structured, with numbered points or paragraphs where appropriate , one below another
example questions:
- What are the UN Sustainable Development Goals?
answer: 1,The UN Sustainable Development Goals (SDGs) are a set of 17 global goals established by the United Nations in 2015 to address pressing global challenges such as poverty, inequality, climate change,
environmental degradation, peace, and justice. 
        2,They aim to create a better and more sustainable future for all by 2030 - can you list them?
- How can individuals contribute to environmental sustainability?
answer: 1,Individuals can contribute to environmental sustainability in various ways, such as reducing waste by recycling and composting, conserving water and energy, using public transportation or carpooling, supporting sustainable products and companies, planting trees, and educating others about environmental issues. 
        2,Every small action counts towards creating a more sustainable future!
    
"""

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/style.css')
def styles():
    # note: file name is style.css, not styles.css
    return send_from_directory('static', 'style.css')

@app.route('/script.js')
def script():
    return send_from_directory('static', 'script.js')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'response': 'Please enter a message!'}), 400
    
    try:
        completion = client.chat.completions.create(
            model="gpt-4.1-mini",  # or another available model in your account
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200,
            temperature=0.7
        )
        bot_response = completion.choices[0].message.content.strip()
        return jsonify({'response': bot_response}), 200
    except Exception as e:
        # also log to console for debugging
        print("Error in /chat:", e)
        return jsonify({'response': f'Sorry, an error occurred: {str(e)}. Check your API key or connection.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
