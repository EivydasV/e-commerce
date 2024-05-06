import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: CreateSuperAdminUserQuestions.name })
export class CreateSuperAdminUserQuestions {
  @Question({
    message: 'Enter First Name',
    name: 'firstName',
  })
  parseFirstName(val: string) {
    return val;
  }

  @Question({
    message: 'Enter Last Name',
    name: 'lastName',
  })
  parseLastName(val: string) {
    return val;
  }

  @Question({
    message: 'Enter Email',
    name: 'email',
  })
  parseEmail(val: string) {
    return val;
  }

  @Question({
    message: 'Enter Password',
    name: 'password',
    type: 'password',
  })
  parsePassword(val: string) {
    return val;
  }

  @Question({
    message: 'Re-enter Password',
    name: 'reEnterPassword',
    type: 'password',
  })
  parseReEnterPassword(val: string) {
    return val;
  }
}
