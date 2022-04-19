import 'package:common/model/response/user.dart';
import 'package:common/repository/interface/auth_interface.dart';
import 'package:common/service/auth_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authenticationRepo = Provider<IAuthRepository>((ref) => AuthRepository());

class AuthRepository implements IAuthRepository {
  AuthRepository();

  AuthService get service => AuthService();

  @override
  Future<User> signInWithGoogle() async {
    try {
      return await service.signInWithGoogle();
    } catch (err) {
      throw Exception();
    }
  }

  @override
  Future<void> signOut() async {
    try {
      await service.signOut();
    } catch (err) {
      throw Exception();
    }
  }

  @override
  Future<User> getUser() async {
    try {
      return await service.getUser();
    } catch (err) {
      throw Exception();
    }
  }
}
