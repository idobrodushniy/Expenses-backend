from rest_framework import serializers
from app1.models import Expenses
from django.contrib.auth.models import User, Group


class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = ('id', 'cost', 'text', 'date','time', 'owner')


class UserSerializer(serializers.ModelSerializer):
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

    def update(self,instance,validated_data):
        if validated_data.get('password') != None and validated_data.get('password') != "":
            if instance.password != validated_data['password']:
                instance.set_password(validated_data['password'])
        if validated_data.get('username') != None and validated_data.get('username') != "":
            instance.username = validated_data['username']
        if validated_data.get('email') != None and validated_data.get('email') != "":
            instance.email = validated_data['email']
        if validated_data.get('groups') != None and validated_data.get('groups') != []:
            instance.groups = validated_data['groups']
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('id','username', 'password', 'email', 'expenses','groups')
