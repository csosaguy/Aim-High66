import React from 'react';
import { 
  Server, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  HardDrive,
  Laptop
} from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const stacks = [
    {
      title: 'Windows Server & Active Directory',
      badge: 'MICROSOFT CERTIFIED',
      desc: 'Windows Server 2016~2025 환경 구축, 도메인 컨트롤러(AD DC) 이전, Group Policy(GPO) 보안 정책, Hyper-V 이중화, 파일서버 권한 재구성.',
      items: ['Active Directory & LDAP', 'Hyper-V Failover Cluster', 'WSUS & Windows DNS/DHCP', 'Remote Desktop Services (RDS)'],
      color: 'from-blue-600/20 to-blue-900/10',
      border: 'border-blue-500/30'
    },
    {
      title: 'Linux Enterprise & Open Source',
      badge: 'RED HAT RHCE LEVEL',
      desc: 'Ubuntu Server, RHEL, Rocky Linux, Debian 커널 패닉 디버깅, systemd 서비스 복구, NGINX 리버스 프록시, Docker/K8s 노드 복구.',
      items: ['Ubuntu 22.04/24.04 LTS & RHEL', 'Kernel Panic & Bootloader (GRUB)', 'SSH Hardening & iptables/UFW'],
      color: 'from-amber-600/20 to-amber-900/10',
      border: 'border-amber-500/30'
    },
    {
      title: 'Virtual Machine (VMware & Proxmox)',
      badge: 'VIRTUALIZATION SPECIALIST',
      desc: 'VMware vSphere/ESXi 7.0/8.0 vCenter 클러스터 마이그레이션, Proxmox VE 오픈소스 가상화 구축, 스토리지 iSCSI/NFS 마운트.',
      items: ['VMware ESXi & vCenter vMotion', 'High Availability', 'Veritas Net Backup & Replication', 'SAN/NAS iSCSI Multi-Pathing'],
      color: 'from-purple-600/20 to-purple-900/10',
      border: 'border-purple-500/30'
    },
    {
      title: 'macOS & Apple Enterprise Fleet',
      badge: 'APPLE SILICON READY',
      desc: '스타트업 및 크리에이티브 스튜디오 M1/M2/M3/M4 Mac 사내망 통합, Synology 10GbE SMB 속도 최적화, MDM 프로필 및 방화벽 설정.',
      items: ['macOS Sequoia/Sonoma SMB 최적화', 'Apple MDM & FileVault 중앙 암호화', '10GbE Thunderbolt 네트워킹', 'Active Directory'],
      color: 'from-slate-600/20 to-slate-900/10',
      border: 'border-slate-500/30'
    },
    {
      title: 'Disaster Recovery',
      badge: 'RANSOMWARE RESCUE',
      desc: '스토리지 장애 복구, 불변(Immutable) 스냅샷, 클라우드 백업',
      items: ['Snapshots & Restore Point', 'RAID 5/6/10 볼륨 깨짐 복구', '24시간 무중단 Failover 구성'],
      color: 'from-emerald-600/20 to-emerald-900/10',
      border: 'border-emerald-500/30'
    },
  ];

  return (
    <section id="tech-stack" className="py-20 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[18px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            검증된 기술력 & Multi-OS 노하우
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            어떤 복잡한 IT 환경이라도 현장에서 즉시 진단합니다
          </h2>
          <p className="text-base text-slate-300">
            "Windows, Linux, Mac OS 및 Virtual Machine(VM) 환경을 아우르는 수십 년의 현장 문제 해결 노하우."
          </p>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stacks.map((stack, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stack.color} border ${stack.border} backdrop-blur-sm space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700">
                  {stack.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{stack.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{stack.desc}</p>

              <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                {stack.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
