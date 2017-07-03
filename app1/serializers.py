from rest_framework import serializers
from app1.models import Expenses
from django.contrib.auth.models import User, Group


class ExpensesSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    date = serializers.ReadOnlyField()
    time = serializers.ReadOnlyField()

    class Meta:
        model = Expenses
        fields = ('id', 'cost', 'text', 'date','time', 'owner')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    expenses = serializers.HyperlinkedRelatedField(many=True,
                                                   view_name='expenses-detail',
                                                   read_only=True
    )

    def create(self,validated_data):
        user = User.objects.create(username = validated_data['username'],
                                   email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.groups.add(Group.objects.get(name='Native User'))
        user.save()
        return user

    class Meta:
        model = User
        fields = ('id','username', 'password', 'email', 'expenses')
