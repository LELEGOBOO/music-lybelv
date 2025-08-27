from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/contact', methods=['POST'])
def contact():
    data = request.form
    ip = request.remote_addr
    response = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "message": data.get("message"),
        "ip": ip
    }
    print("New contact submission:", response)
    return jsonify({"status": "success", "data": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
