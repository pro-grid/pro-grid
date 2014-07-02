PG_BUILD_DIR=/var/local/www
PG_EXEC=vagrant ssh -c
PG_SYNC=vagrant rsync
PG_VAGRANT=$(PG_EXEC)
PG_CD=cd $(PG_BUILD_DIR) &&

sync:
	$(PG_SYNC)

watch: 
	vagrant up

test:
	$(PG_VAGRANT) "$(PG_CD) ./node_modules/.bin/mocha --reporter list"

logs:
	$(PG_VAGRANT) 'tail -f -n 20 /var/log/node.log'

jshint:
	$(PG_VAGRANT) '$(PG_CD) ./node_modules/jshint/bin/jshint --reporter node_modules/jshint-stylish/stylish.js lib/*.js test/*.js'

install: sync
	$(PG_VAGRANT) '$(PG_CD) npm prune && npm install'

destoroyah:
	vagrant destroy -f && vagrant up

.PHONY: test watch jshint install sync
