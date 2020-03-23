#
# admin scripts
#
# when setting up a new machine for hackathons:
#	scripts/create_hackathon_account (run from the top of the source tree)
#
# after that, the flow of the admin steps is:
#	foreach hackathon:
#		create a local clone of the hackathon repo in /home/hackathon
#			example:
#			cd /home/hackathon
#			git clone https://githib.com/pmemhackathon/2019-07-07
#		create_pmemusers (creates all 200 accounts)
#			example: create_pmemusers 2019-07-07
#
#		foreach session with same users (or on system boot):
#			start the webhackathon daemon as root:
#				cd /home/hackathon
#				./webhackathon reponame &
#
#			enable_pmemusers 1 100 todayspasswd
#
#			...hack...hack...hack
#
#			if system is rebooted, restart containers:
#				docker start $(docker ps -aq -f name=pmemuser)
#			users can be disabled selectively using docker stop.
#
#		after everyone is done and won't come back:
#			kill the webhackathon daemon
#			delete_pmemusers (removes all pmemuserX accounts)
#
# we assume ID:GID 5000:5000 for the hackathon account and the range
# 5001:5001 through 5200:5200 are available for the 200 user accounts
# created.  edit all the scripts and change $BASEID if that has to change
# for some reason.
