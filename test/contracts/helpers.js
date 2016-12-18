import supertest from 'supertest';
import chai from 'chai';
import Joi from 'joi';
import JoiAssert from 'joi-assert';
import jwt from 'jwt-simple';
import app from '../../app';

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;
global.Joi = Joi;
global.JoiAssert = JoiAssert;
global.jwt = jwt;
