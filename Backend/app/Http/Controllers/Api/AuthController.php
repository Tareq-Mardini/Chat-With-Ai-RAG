<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;

class AuthController extends Controller
{
  /**
   * تسجيل حساب جديد
   */
  public function register(RegisterRequest $request): JsonResponse
  {
    $user = User::create([
      'name'     => $request->name,
      'email'    => $request->email,
      'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
      'success' => true,
      'message' => 'Account created successfully',
      'data'    => [
        'user'         => new UserResource($user),
        'token'        => $token,
        'token_type'   => 'Bearer',
      ],
    ], 201);
  }

  public function login(LoginRequest $request): JsonResponse
  {
    if (!Auth::attempt($request->only('email', 'password'))) {
      return response()->json([
        'success' => false,
        'message' => 'Wrong in the password or email',
      ], 401);
    }

    /** @var \App\Models\User $user */
    $user = Auth::user();

    // حذف التوكنات القديمة (اختياري - لأمان أكثر)
    $user->tokens()->delete();

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
      'success' => true,
      'message' => 'You have logged in successfully',
      'data'    => [
        'user'       => new UserResource($user),
        'token'      => $token,
        'token_type' => 'Bearer',
      ],
    ], 200);
  }

  /**
   * تسجيل الخروج
   */
  public function logout(Request $request): JsonResponse
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'success' => true,
      'message' => 'تم تسجيل الخروج بنجاح',
    ], 200);
  }

  /**
   * جلب بيانات المستخدم الحالي
   */
  public function me(Request $request): JsonResponse
  {
    return response()->json([
      'success' => true,
      'data'    => new UserResource($request->user()),
    ], 200);
  }
}
