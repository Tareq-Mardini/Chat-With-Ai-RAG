<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name'     => ['required', 'string', 'min:2', 'max:100'],
      'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
      'password' => ['required', 'string', 'min:8', 'confirmed'],
    ];
  }

  public function messages(): array
  {
    return [
      'name.required'      => 'Name is required.',
      'name.min'           => 'Name must be at least 2 characters.',
      'name.max'           => 'Name may not exceed 100 characters.',

      'email.required'     => 'Email address is required.',
      'email.email'        => 'Please provide a valid email address.',
      'email.unique'       => 'This email address is already registered.',

      'password.required'  => 'Password is required.',
      'password.min'       => 'Password must be at least 8 characters.',
      'password.confirmed' => 'Password confirmation does not match.',
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
        'message' => 'The given data was invalid.',
        'errors'  => $errors,
      ], 422)
    );
  }
}
