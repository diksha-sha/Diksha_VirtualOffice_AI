from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory database (you can later connect MongoDB/Postgres/MySQL)
attendance_records = []

@app.route("/attendance/checkin", methods=["POST"])
def checkin():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({"error": "Name and email required"}), 400

    record = {
        "name": name,
        "email": email,
        "status": "checked-in"
    }
    attendance_records.append(record)
    return jsonify({"message": "Check-in successful", "record": record}), 200


@app.route("/attendance/checkout", methods=["POST"])
def checkout():
    data = request.get_json()
    email = data.get("email")

    for rec in attendance_records:
        if rec["email"] == email and rec["status"] == "checked-in":
            rec["status"] = "checked-out"
            return jsonify({"message": "Check-out successful", "record": rec}), 200

    return jsonify({"error": "No active check-in found"}), 404


@app.route("/attendance/records", methods=["GET"])
def get_records():
    return jsonify(attendance_records), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
