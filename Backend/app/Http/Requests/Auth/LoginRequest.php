<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'email'    => ['required', 'string', 'email'],
      'password' => ['required', 'string'],
    ];
  }

  public function messages(): array
  {
    return [
      'email.required'    => 'Email address is required.',
      'email.email'       => 'Please provide a valid email address.',
      'password.required' => 'Password is required.',
    ];
  }

  protected function failedValidation(Validator $validator): void
  {
    $errors = collect($validator->errors()->toArray())
      ->map(fn($messages) => $messages[0]);

    throw new HttpResponseException(
      response()->json([
        'status'  => 'error',
        'code'    => 'VALIDATION_ERROR',
        'message' => 'Invalid login data.',
        'errors'  => $errors,
      ], 422)
    );
  }
}
