const {
  createStudent, 
  getStudents, 
  validateStudent, 
  getSingleStudent } = require('../../tables/student/controller');

const db = require('../../database');

jest.mock('../../database');

describe('Student Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {

    it('should handle email already exists error', async () => {
      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rows: [{ email: 'test@email.com' }] });
      });

      const mockRequest = {
        body: {
          email: 'test@email.com',
        },
      };
      const mockResponse = {
        send: jest.fn(),
      };

      await createStudent(mockRequest, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith('Email already exists');
    });

    it('should handle username already exists error', async () => {

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, {rows: 0});
      });

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rows: [{ username: 'johndoe' }] });
      });

      const mockRequest = {
        body: {
          username: '',
        },
      };

      const mockResponse = {
        send: jest.fn(),
      };

      await createStudent(mockRequest, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith('Username already exists');
    });

    it('should handle creating a student successfully', async () => {

      const mockStudent = {
        username: 'mock-username',
        grade_level: 'mock-grade-level',
        major: 'mock-major',
        school: 'mock-school',
        email: 'mock-email',
        password: 'mock-password',
      }

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, {rows: 0});
      });

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rows: 0});
      });

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rows: mockStudent});
      });

      const mockRequest = {
        body: {
        },
      };

      const mockResponse = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await createStudent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.send).toHaveBeenCalledWith('Student created!');
    });

  });

  describe('getStudents', () => {
    it('should fetch all students', async () => {
      const mockStudents = [{ 
        username: 'mock-username-1' 
      }, 
      { 
        username: 'mock-username-2' 
      }];

      db.query.mockImplementationOnce((query, callback) => {
        callback(null, { rows: mockStudents });
      });

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getStudents({}, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockStudents);
    });

  });

  describe('validateStudent', () => {
    it('should validate student credentials', async () => {
      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rowCount: 1 });
      });

      const mockRequest = {
        body: {
          email: 'test@email.com',
          password: 'testPassword',
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      };

      await validateStudent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.redirect).toHaveBeenCalledWith('/dashboard');
    });

    //... Error handling and login failed test
    it('should handle errors when trying to validate student credentials', async () => {
      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rowCount: 0 });
      });

      const mockRequest = {
        body: {
          email: 'test@email.com',
          password: 'testPassword',
        },
      };
      const mockResponse = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn(),
      };

      await validateStudent(mockRequest, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith('LOG IN FAILED!');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

  });

  describe('getSingleStudent', () => {

    it('should fetch a single student by username', async () => {
      const mockStudent = { username: 'testUsername' };
      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { rows: [mockStudent] });
      });

      const mockRequest = {
        body: {
          username: 'testUsername',
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getSingleStudent(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([mockStudent]);
    });
  });

});
