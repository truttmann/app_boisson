#!/bin/bash
if [ -z $1 ] 
	then echo "USAGE: deploy.sh [staging|production]" 
	exit 1
fi

branch=$(git symbolic-ref --short -q HEAD)
echo 'current branch :' $branch

if [ $1 = "staging" ] 
	then  ssh 992995@git.dc0.gpaas.net 'deploy staging.mobile.ddo-it.fr.git' master
elif [ $1 = "production" ]
	then 
		if [ $branch != "master" ]
			then echo "Warning not secure to deploy from another branch than master." ; exit 1
		fi
		ssh 992995@git.dc0.gpaas.net 'deploy mobile.ddo-it.fr.git' master
else 
	echo "USAGE deploy.sh [staging|production]"
	exit 1
fi
