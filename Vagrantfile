# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 9001, host: 9001

  build_path = "/var/local/www"

  config.vm.synced_folder ".", build_path, type: "rsync",
    rsync__exclude: [
      ".git/", 
      "lib/", 
      "site/", 
      "test/", 
      "node_modules",
      "vendor/",
      ".heroku",
      ".profile.d"
    ]
  config.vm.synced_folder "lib/", build_path+"/lib"
  config.vm.synced_folder "site/", build_path+"/site"
  config.vm.synced_folder "test/", build_path+"/test"
  config.vm.synced_folder "node_modules/", build_path+"/node_modules"

  config.vm.provision "shell",
    path: "./provisioning/install.sh",
    args: build_path,
    keep_color: true

  config.vm.provision "shell", inline: "initctl start pro-grid", run: "always"

end
