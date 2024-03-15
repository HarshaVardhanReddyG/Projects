from mininet.net import Mininet
from mininet.topo import Topo
from mininet.node import Host, OVSSwitch
from mininet.link import TCLink

class SimpleTopology(Topo):
    def build(self):
        switch = self.addSwitch('s1')
        host1 = self.addHost('h1')
        host2 = self.addHost('h2')
        host3 = self.addHost('h3')
        host4 = self.addHost('h4')

        self.addLink(host1, switch, bw=10)  # Adjust bandwidth as needed
        self.addLink(host2, switch, bw=10)
        self.addLink(host3, switch, bw=10)
        self.addLink(host4, switch, bw=20)


topo = SimpleTopology()
net = Mininet(topo=topo, switch=OVSSwitch, link=TCLink)
net.start()
net.interact()
net.stop()