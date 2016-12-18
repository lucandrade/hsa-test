import supertest from 'supertest';
import chai from 'chai';
import jwt from 'jwt-simple';
import app from '../../app';

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;
global.assert = chai.assert;
global.jwt = jwt;
