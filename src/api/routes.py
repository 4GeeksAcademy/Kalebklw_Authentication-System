"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/sign_up', methods=['POST'])
def user_sign_up():

    body = request.json
    new_email = body['email']
    new_password = body['password']
    new_user = User(
        email=new_email,
        password=generate_password_hash(new_password)
    )

    response_body = {
        "message": new_email + " has been registered!",
        "user": new_user.serialize()
    }

    db.session.add(new_user)
    db.session.commit()
    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def user_login():
    body = request.json
    new_email = body['email']
    new_password = body['password']
    main_user = User.query.filter_by(email=new_email).first()
    if not main_user:
        return jsonify("No matching Email!"), 401

    if not check_password_hash(main_user.password, new_password):
        return jsonify("Password is incorrect"), 401

    token = create_access_token(identity=new_email)

    response_body = {
        "message": "Welcome ",
        "user": main_user.serialize(),
        "token": token
    }

    return jsonify(response_body), 200


@api.route('/user', methods=['GET'])
@jwt_required()
def fetch_user():
    user_email = get_jwt_identity()
    print("USER EMAIL TAG!!!!!!!!: ", user_email)
    main_user = User.query.filter_by(email=user_email).first()
    resp = {
        "data": main_user.serialize(),
        "msg": "User fetched"
    }

    return jsonify(resp), 200

# hash
# password = pass123
# hashpassword = ndklahcjwyahdjwadjdnmkndwhj

# token
# identity = email(of user)
# token = hdjahjdaj
