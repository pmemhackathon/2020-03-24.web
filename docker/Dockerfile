#
# dockerfile for pmemhackathon, fc30 based
#
# fc30's packages for:
#	ndctl are at 65 or higher
#	pmdk (core) are at 1.6 or higher
#	libpmemobj++ at 1.6 and libpmemkv needs 1.7, so we build it
#	memkind at 1.7.0 and we need 1.9.0, so we build it
#	valgrind with pmem support isn't available, so we build it
#	libpmemkv isn't upstream yet, so build it (and bindings dependencies)

FROM fedora:30

LABEL maintainer="andy.rudoff@intel.com"

RUN dnf update -y && dnf install -y\
	asciidoc\
	asciidoctor\
	autoconf\
	automake\
	bash-completion\
	bc\
	bind-utils\
	binutils\
	clang\
	cmake\
	daxctl-devel\
	doxygen\
	emacs\
	file\
	findutils\
	fuse\
	fuse-devel\
	gcc\
	gcc-c++\
	gdb\
	git-all\
	glib2-devel\
	golang\
	gtest-devel\
	hub\
	json-c-devel\
	keyutils-libs-devel\
	kmod-devel\
	lbzip2\
	libtool\
	libudev-devel\
	libunwind-devel\
	libuuid-devel\
	libuv-devel\
	make\
	man\
	nano\
	ncurses-devel\
	ndctl-devel\
	numactl-devel\
	java-1.8.0-openjdk\
	openssh-server\
	pandoc\
	passwd\
	perl-Text-Diff\
	pkgconfig\
	python3-devel\
	rapidjson-devel\
	rpm-build\
	rpm-build-libs\
	rpmdevtools\
	rsync\
	ruby-devel\
	strace\
	tar\
	tbb-devel\
	unzip\
	vim-enhanced\
	wget\
	which\
	xmlto\
	xmvn

RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -

RUN dnf install -y nodejs

RUN dnf debuginfo-install -y glibc

RUN dnf clean all

COPY pmdk.sh memkind.sh valgrind.sh pmemobj-cpp.sh pmemkv.sh pmemkv-jni.sh pmemkv-java.sh pmemkv-python.sh pmemkv-nodejs.sh pmemkv-ruby.sh tz.sh /

RUN /pmdk.sh
RUN /memkind.sh
RUN /valgrind.sh
RUN /pmemobj-cpp.sh
RUN /pmemkv.sh
RUN /pmemkv-jni.sh
RUN /pmemkv-java.sh
RUN /pmemkv-python.sh
RUN /pmemkv-nodejs.sh
RUN /pmemkv-ruby.sh
RUN /tz.sh

RUN rm /pmdk.sh /memkind.sh /valgrind.sh /pmemobj-cpp.sh /pmemkv.sh /pmemkv-jni.sh /pmemkv-java.sh /pmemkv-python.sh /pmemkv-nodejs.sh /pmemkv-ruby.sh /tz.sh
